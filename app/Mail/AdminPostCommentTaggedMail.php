<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class AdminPostCommentTaggedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
  
    private $details;
  
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details)
    {
        $this->details = $details;
    }
  
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->details['post_type'] === "teacher"){
            $routeUrl = route('teacher.adminposts.show', ($this->details['post_id']));
        }
        if($this->details['post_type'] === "student"){
            $routeUrl = route('student.adminposts.show', ($this->details['post_id']));
        }
        if($this->details['post_type'] === "admin"){
            $routeUrl = route('admin.adminposts.show', ($this->details['post_id']));
        }
        return $this->subject('Casen Connect Post/Comment Mail')
                    ->markdown('emails.admin-tagged-mail')->with([
                            'details' => $this->details,
                            'routeUrl' => $routeUrl,
                        ]);
    }
}