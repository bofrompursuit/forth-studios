import QRCode from "react-qr-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, MessageCircle, QrCode } from "lucide-react";
import { Button } from "../components/ui/button";

export function Contact() {
  const whatsappNumber = "16469669675";
  const email = "bo.moldenhauer@pursuit.org";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const emailUrl = `mailto:${email}`;

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 sm:px-6 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-4xl sm:text-5xl md:text-6xl text-transparent">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-400">
            Interested in working together or have questions about my AI-generated content? 
            Feel free to reach out via WhatsApp or email.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {/* WhatsApp Card */}
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <MessageCircle className="size-5 sm:size-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">WhatsApp</CardTitle>
                  <CardDescription className="text-sm">Quick response via messaging</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center rounded-lg bg-white p-4 sm:p-6">
                <QRCode
                  value={whatsappUrl}
                  size={160}
                  level="H"
                  className="w-full max-w-[160px] sm:max-w-[200px] h-auto"
                />
              </div>
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-400">
                  <QrCode className="size-4" />
                  Scan to chat on WhatsApp
                </div>
                <p className="text-sm sm:text-base text-neutral-300">+1 (646) 966-9675</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(whatsappUrl, '_blank')}
                >
                  Open WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Mail className="size-5 sm:size-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">Email</CardTitle>
                  <CardDescription className="text-sm">Send me a detailed message</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center rounded-lg bg-white p-4 sm:p-6">
                <QRCode
                  value={emailUrl}
                  size={160}
                  level="H"
                  className="w-full max-w-[160px] sm:max-w-[200px] h-auto"
                />
              </div>
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-400">
                  <QrCode className="size-4" />
                  Scan to send an email
                </div>
                <p className="text-sm sm:text-base text-neutral-300 break-all">{email}</p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(emailUrl, '_blank')}
                >
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 text-center">
          <h3 className="mb-2 text-base sm:text-lg text-white">Response Time</h3>
          <p className="text-sm sm:text-base text-neutral-400">
            I typically respond to WhatsApp messages within a few hours and emails within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}