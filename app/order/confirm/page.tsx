import { redirect } from 'next/navigation'

// The review step is gone: the form's last step sends the request directly. Old links land back on the form.
export default function ConfirmPage() {
  redirect('/order')
}
