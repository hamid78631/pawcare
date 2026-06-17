import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = config.get('SMTP_HOST');
    const user = config.get('SMTP_USER');
    const pass = config.get('SMTP_PASS');
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('SMTP_PORT') ?? 587,
        secure: false,
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP non configuré — les emails seront loggués uniquement');
    }
  }

  async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[EMAIL] To: ${to} | Sujet: ${subject}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.config.get('EMAIL_FROM') ?? 'PawCare <noreply@pawcare.fr>',
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Échec envoi email à ${to}`, err);
    }
  }

  async sendBookingCreated(sitterEmail: string, sitterName: string, ownerName: string, startDate: string, endDate: string) {
    const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    await this.send(
      sitterEmail,
      '🐾 Nouvelle demande de garde — PawCare',
      `<div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#2d6a4f">Nouvelle demande de garde</h2>
        <p>Bonjour <strong>${sitterName}</strong>,</p>
        <p><strong>${ownerName}</strong> vous a envoyé une demande de garde
           du <strong>${fmt(startDate)}</strong> au <strong>${fmt(endDate)}</strong>.</p>
        <p>Connectez-vous à PawCare pour confirmer ou refuser la demande.</p>
        <a href="http://localhost:5173/home" style="display:inline-block;padding:10px 22px;background:#2d6a4f;color:white;border-radius:8px;text-decoration:none;font-weight:700">Voir la demande</a>
      </div>`,
    );
  }

  async sendBookingStatusChanged(ownerEmail: string, ownerName: string, sitterName: string, status: string, startDate: string) {
    const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const confirmed = status === 'confirmed';
    await this.send(
      ownerEmail,
      confirmed ? '✅ Réservation confirmée — PawCare' : '❌ Réservation refusée — PawCare',
      `<div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#2d6a4f">Mise à jour de votre réservation</h2>
        <p>Bonjour <strong>${ownerName}</strong>,</p>
        <p>Votre réservation avec <strong>${sitterName}</strong> prévue le <strong>${fmt(startDate)}</strong>
           a été <strong>${confirmed ? 'confirmée ✅' : 'refusée ❌'}</strong>.</p>
        <a href="http://localhost:5173/home" style="display:inline-block;padding:10px 22px;background:#2d6a4f;color:white;border-radius:8px;text-decoration:none;font-weight:700">Voir mes réservations</a>
      </div>`,
    );
  }
}
