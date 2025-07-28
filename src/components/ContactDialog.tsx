import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Language, contactFormTranslations } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/utils";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  language: Language;
}

export const ContactDialog = ({ open, onOpenChange, subject, language }: ContactDialogProps) => {
  const t = contactFormTranslations[language];
  const [email, setEmail] = useState("");
  const [localSubject, setLocalSubject] = useState(subject);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLocalSubject(subject);
  }, [subject]);

  const handleSend = () => {
    const body = `From: ${email}\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(localSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder={t.subject}
            value={localSubject}
            onChange={(e) => setLocalSubject(e.target.value)}
          />
          <Textarea
            placeholder={t.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleSend}>{t.send}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
