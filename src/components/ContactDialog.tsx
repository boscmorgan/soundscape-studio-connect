import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mailtoLink } from '@/lib/utils';
import { contact as t } from '@/content';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Contact overlay. Composes a mailto: so there is no backend to maintain and
 * no inbox credentials in the client.
 */
export const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = email ? `From: ${email}\n\n${message}` : message;
    window.location.href = mailtoLink(subject || t.defaultSubject, body);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-[--space-sm]">
            <Input
              type="email"
              autoComplete="email"
              placeholder={t.email}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder={t.subject}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <Textarea
              rows={5}
              placeholder={t.message}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <DialogFooter className="mt-[--space-md]">
            <Button type="submit">{t.send}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
