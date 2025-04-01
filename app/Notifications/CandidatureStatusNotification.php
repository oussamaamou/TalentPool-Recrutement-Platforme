<?php

namespace App\Notifications;

use App\Models\Candidature;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CandidatureStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $candidature;
    protected $statut;

    /**
     * Create a new notification instance.
     */
    public function __construct(Candidature $candidature, string $statut)
    {
        $this->candidature = $candidature;
        $this->statut = $statut;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusMessage = match($this->statut) {
            'Accepte' => 'a été acceptée',
            'Refuse' => 'a été refusée',
            default => 'a changé de statut'
        };

        return (new MailMessage)
            ->subject('Mise à jour de votre candidature')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Votre candidature pour l\'annonce "' . $this->candidature->annonce->title . '" ' . $statusMessage . '.')
            ->line('Statut actuel: ' . $this->statut)
            ->action('Voir les détails', url('/candidatures/' . $this->candidature->id))
            ->line('Merci d\'utiliser notre plateforme!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'candidature_id' => $this->candidature->id,
            'annonce_id' => $this->candidature->annonce_id,
            'annonce_title' => $this->candidature->annonce->title,
            'nouveau_statut' => $this->statut
        ];
    }
}