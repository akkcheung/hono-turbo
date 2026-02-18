import hotwiredturbo from 'https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.23/+esm'
// import hotwiredstimulus from 'https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/+esm' 
import { Application, Controller } from 'https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/+esm' 

const application = Application.start() 

application.register("reset-form", class extends Controller{
  clear(event){

    // Turbo fires 'turbo:submit-end'.
    // detail.success is true if the server returned a 2xx or 3xx status
    if (event.detail.success){
      this.element.reset()

      const input = this.element.querySelector('input')
      if (input) input.focus()
    }
  }
});

console.log("Turbo & Stimulus initialized via CDN")
