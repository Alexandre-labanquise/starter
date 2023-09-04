import * as params from "@params";
const tenant = params.tenant;

const alertUser = ({ email, reason }) => {
  alert(
    `Pourquoi êtes-vous tombés ? Il ne faut pas faire ca ! Motif de la chute : ${reason}. Nous vous recontacterons à ${email} pour vous humilier encore plus.`
  );
};

export const sendContact = (event) => {
  event.preventDefault();
  const myForm = document.getElementById("contact-form");
  const formData = new FormData(myForm);
  let contact = {};
  for (const [name, value] of formData.entries()) {
    contact[name] = value;
  }
  contact.tenant = tenant;
  // apiContact(data)
  //   .then((resp) => {
  //     // Throw error when status is not ok
  //     if (resp.status !== 202)
  //       return Promise.reject(new Error(`Bad status ${resp.status}`));
  //     alert(
  //       "Votre message a bien été envoyé. Nous revenons vers vous rapidement."
  //     );
  //     myForm.reset();
  //   })
  //   .catch((err) => console.error(err));
  alertUser(contact);
};

// Use this function to send email
const apiContact = async (contact) => {
  try {
    const response = await fetch("test", {
      method: "POST",
      body: `{"title":"Mail de contact", "name":"${contact.name}","email":"${contact.email}", "phone":"${contact.tel}", "message":"${contact.message}", "tenant": "${contact.tenant}"}`,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

function launchCheckPoints() {
  const contactForm = document.getElementById("contact-form");
  if (!!contactForm) {
    contactForm.addEventListener("submit", sendContact);
  }
}

// Listeners
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", launchCheckPoints);
} else {
  // `DOMContentLoaded` has already fired
  launchCheckPoints();
}
