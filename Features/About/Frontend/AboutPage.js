import { LitElement, html } from "../../../Libraries/lit/lit.min.js";

export class AboutPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="container my-4">
        <p>
          Αυτό το εργαλείο είναι μια προσωπική προσπάθεια να οργανώσω και να μοιραστώ τη γνώση μου
          γύρω από τη θεωρία του μπουζουκιού — δρόμους, νότες, συγχορδίες, μακάμια και άλλα.
        </p>
        <p>
          Δεν είμαι επαγγελματίας μουσικός ή δάσκαλος. Ασχολούμαι ερασιτεχνικά με το μπουζούκι και
          τη θεωρία του, και το έφτιαξα καθαρά για το μεράκι μου.
        </p>
        <p>
          Βασίστηκα σε ό,τι μπόρεσα να βρω — βιβλία, βίντεο, forums — και προσπάθησα να τα
          συγκεντρώσω σε μια απλή και πρακτική εφαρμογή, χωρίς διαφημίσεις ή πληρωμές.
        </p>
        <p>
          Αν δείτε κάποιο λάθος ή θέλετε να προτείνετε κάτι (π.χ. έναν νέο δρόμο), μη διστάσετε να
          μου στείλετε email στο
          <a href="mailto:efthymios.ks@gmail.com">efthymios.ks@gmail.com</a>.
        </p>
        <p>
          Τον κώδικα της εφαρμογής μπορείτε να τον βρείτε
          <a
            href="https://github.com/efthymios-ks/bouzouki-notes"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary text-decoration-underline"
          >
            εδώ στο GitHub </a
          >.
        </p>
      </div>
    `;
  }
}

customElements.define("about-page", AboutPage);
