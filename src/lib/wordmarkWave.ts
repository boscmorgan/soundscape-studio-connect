/**
 * The wave itself: one textured quad, one fragment shader, no scene graph.
 *
 * The technique is the one from Codrops' "Wave motion effect on an image with
 * three.js" — a continuous noise-and-sine field driving a displacement, with
 * the colour channels sampled a hair apart — but the mark is a single quad
 * rather than a subdivided plane, so the displacement is done per pixel in the
 * fragment shader instead of per vertex. That is both cheaper and smoother
 * here: a 16x16 grid would quantise a wave running through letterforms, and
 * the whole reason for this rewrite is that the distortion should be
 * continuous across the mark.
 *
 * Written against raw WebGL rather than three.js. This is a wordmark, and the
 * library would outweigh the entire rest of the bundle.
 */

export interface WaveSettings {
  /** Vertical travel and horizontal squash, in CSS px. */
  amplitude: number;
  sway: number;
  /** Swells across the word, per layer. */
  cycles: number;
  cycles2: number;
  cyclesNoise: number;
  /** Seconds per period, per layer. */
  duration: number;
  duration2: number;
  drift: number;
  /** Share of the field taken from noise rather than the sines, 0–1. */
  noise: number;
  /** Magnification at the crests, as a ratio. */
  depth: number;
  /** Top-to-bottom shear through the turn, in CSS px. */
  lean: number;
  /** RGB split along the direction of travel, in CSS px. */
  aberration: number;
}

export interface WaveGeometry {
  /** Canvas size in CSS px. */
  width: number;
  height: number;
  pixelRatio: number;
  /** Width of the word as a fraction of the texture. */
  span: number;
}

export interface WaveRenderer {
  setTexture(source: TexImageSource): void;
  setGeometry(geometry: WaveGeometry): void;
  setSettings(settings: WaveSettings): void;
  /** Drives the clock. Off still paints — it paints the field at t = 0. */
  setRunning(running: boolean): void;
  render(): void;
  destroy(): void;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uTexel;       // 1 / texture size, so px uniforms can stay px
uniform float uTime;       // seconds
uniform float uSpan;       // texture width / word width

uniform vec3 uCycles;      // swells across the word: primary, second, noise
uniform vec3 uRate;        // 1 / period, same order
uniform vec2 uAmplitude;   // x = sway, y = rise, in px
uniform float uNoise;
uniform float uDepth;
uniform float uLean;
uniform float uAberration;

const float TAU = 6.28318530718;

// Simplex 2D noise — Ian McEwan, Ashima Arts (MIT). Same generator the
// reference uses; it is what keeps the wave from sounding like a metronome.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/*
 * The field. One function of one variable — position along the word — which
 * is exactly why the result reads as a single wave passing through the mark
 * rather than ten letters each doing their own thing.
 *
 * The two sine periods are not integer multiples, so their sum drifts in and
 * out of phase instead of repeating; the noise term is sampled on a slow
 * vertical drift through 2D noise, which gives it a shape that evolves rather
 * than a shape that scrolls.
 */
float field(float x) {
  float a = sin(x * uCycles.x * TAU - uTime * uRate.x * TAU);
  float b = sin(x * uCycles.y * TAU - uTime * uRate.y * TAU + 1.7);
  float n = snoise(vec2(x * uCycles.z, uTime * uRate.z));
  return mix(a * 0.68 + b * 0.32, n, uNoise);
}

void main() {
  // Word space: 0..1 across the mark itself, ignoring the transparent bleed,
  // so "cycles across the word" means the same thing at any mark size.
  float x = (vUv.x - 0.5) * uSpan + 0.5;

  float height = field(x);

  // Central difference for the slope. Normalising by the primary frequency
  // keeps it near -1..1 whatever the tuning, so the px amplitudes below stay
  // meaningful when someone retunes the cycles. The floor matters: at zero
  // cycles this divides by zero, and a NaN here does not degrade the mark, it
  // erases it.
  float e = 0.008;
  float slope = (field(x + e) - field(x - e)) / (2.0 * e * max(uCycles.x, 0.01) * TAU);

  vec2 uv = vUv;

  // Crests lean toward the viewer, so they magnify slightly. This is the
  // cheap stand-in for the reference's perspective camera over a displaced
  // plane, and it is most of what separates a ribbon from a flat wobble.
  vec2 pivot = vec2(uv.x, 0.5);
  uv = pivot + (uv - pivot) / (1.0 + height * uDepth);

  // ...and the top of the letters trails the bottom through the turn.
  uv.x += slope * uLean * (uv.y - 0.5) * 2.0 * uTexel.x;

  // The displacement proper: rise from the field, squash from its steepness.
  uv -= vec2(slope * uAmplitude.x, height * uAmplitude.y) * uTexel;

  // Channel split along the direction of travel — widest where the field is
  // moving fastest, gone at the crests, which is how a lens behaves.
  vec2 split = vec2(slope * 0.35, 1.0) * slope * uAberration * uTexel;

  // The texture arrives premultiplied and the mark is one flat colour, so a
  // sample's coverage is its colour; recombining per channel is the fringe.
  vec4 r = texture2D(uTexture, uv + split);
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - split);

  gl_FragColor = vec4(r.r, g.g, b.b, max(r.a, max(g.a, b.a)));
}
`;

const UNIFORM_NAMES = [
  'uTexture',
  'uTexel',
  'uTime',
  'uSpan',
  'uCycles',
  'uRate',
  'uAmplitude',
  'uNoise',
  'uDepth',
  'uLean',
  'uAberration',
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) {
      console.error('[wordmark] shader failed:', gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const link = (gl: WebGLRenderingContext) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  // The shaders are owned by the program once it is linked.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (import.meta.env.DEV) {
      console.error('[wordmark] link failed:', gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

/**
 * Returns null when WebGL is unavailable or the program will not build, which
 * is the caller's signal to leave the plain DOM copy of the mark on screen.
 */
export const createWaveRenderer = (
  canvas: HTMLCanvasElement,
): WaveRenderer | null => {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    // Nothing here needs a depth buffer or multisampling: it is one quad, and
    // the edges it draws come from the texture, not from geometry.
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });

  if (!gl) return null;

  const program = link(gl);
  if (!program) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {} as Record<UniformName, WebGLUniformLocation | null>;
  for (const name of UNIFORM_NAMES) {
    uniforms[name] = gl.getUniformLocation(program, name);
  }

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // The texture is rasterised at display resolution, so it is never minified
  // and never needs mipmaps — which is also what keeps this WebGL 1 clean,
  // since WebGL 1 cannot mipmap a non-power-of-two texture.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.useProgram(program);
  gl.uniform1i(uniforms.uTexture, 0);
  gl.activeTexture(gl.TEXTURE0);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let frame = 0;
  let running = false;
  let origin = 0;
  let elapsed = 0;
  let hasTexture = false;
  let destroyed = false;

  const paint = () => {
    if (destroyed || !hasTexture) return;
    gl.uniform1f(uniforms.uTime, elapsed);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    if (!running) return;
    elapsed = (now - origin) / 1000;
    paint();
    frame = requestAnimationFrame(tick);
  };

  return {
    setTexture(source) {
      if (destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      hasTexture = true;
    },

    setGeometry({ width, height, pixelRatio, span }) {
      if (destroyed) return;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Texel size is in CSS px, which lets every amplitude uniform be a CSS
      // px value and stay correct across device pixel ratios.
      gl.uniform2f(uniforms.uTexel, 1 / width, 1 / height);
      gl.uniform1f(uniforms.uSpan, 1 / span);
    },

    setSettings(settings) {
      if (destroyed) return;
      gl.uniform3f(
        uniforms.uCycles,
        settings.cycles,
        settings.cycles2,
        settings.cyclesNoise,
      );
      gl.uniform3f(
        uniforms.uRate,
        1 / settings.duration,
        1 / settings.duration2,
        1 / settings.drift,
      );
      gl.uniform2f(uniforms.uAmplitude, settings.sway, settings.amplitude);
      gl.uniform1f(uniforms.uNoise, settings.noise);
      gl.uniform1f(uniforms.uDepth, settings.depth);
      gl.uniform1f(uniforms.uLean, settings.lean);
      gl.uniform1f(uniforms.uAberration, settings.aberration);
    },

    setRunning(next) {
      if (destroyed || next === running) return;
      running = next;
      if (next) {
        // Resume where the clock left off rather than snapping to t = 0.
        origin = performance.now() - elapsed * 1000;
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    },

    render: paint,

    /*
     * Frees what this renderer allocated, and deliberately does NOT call
     * `WEBGL_lose_context.loseContext()`. A canvas whose context has been
     * force-lost hands the same, still-lost context back to the next
     * `getContext('webgl')`, so "tidying up" would make any later renderer on
     * the same canvas element fail to build — permanently, and silently. The
     * context goes when the canvas does.
     */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      cancelAnimationFrame(frame);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
};
