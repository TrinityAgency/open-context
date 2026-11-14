export type ContactLabels = {
  /** The form's field labels. */
  name: string;
  email: string;
  message: string;
  /** The submit button, and its text while the message is being sent. */
  submit: string;
  sending: string;
  /** The status line after sending. */
  sent: string;
  failed: string;
  /** Field errors: an empty field, an invalid email address, a value over its maximum. */
  required: string;
  invalid: string;
  tooLong: string;
  /** The label of the spam trap, read by nobody but bots. */
  honeypot: string;
  /** The notice before the privacy link under the form. */
  notice: string;
  /** The contact details: their heading and the labels of phone and address. */
  contact: string;
  phone: string;
  address: string;
};

export const CONTACT_LABELS: ContactLabels = {
  name: 'Name',
  email: 'Email',
  message: 'Message',
  submit: 'Send message',
  sending: 'Sending…',
  sent: 'Thank you. Your message has been sent.',
  failed: 'Your message could not be sent. Please write to us by email.',
  required: 'Please fill in this field.',
  invalid: 'Please enter a valid email address.',
  tooLong: 'This is too long.',
  honeypot: 'Leave this field empty',
  notice: 'We use your details only to answer your message. More:',
  contact: 'Contact details',
  phone: 'Phone',
  address: 'Address',
};
