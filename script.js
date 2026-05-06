const joinButton = document.querySelector("#joinButton");
const signupForm = document.querySelector(".signup-form");
const formNote = document.querySelector("#formNote");

joinButton?.addEventListener("click", () => {
  formNote.textContent = "Great. Add your reading circle idea below and bring a friend to the meetup.";
  document.querySelector("#circles")?.scrollIntoView({ behavior: "smooth" });
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signupForm);
  const name = String(data.get("name") || "Reader").trim();
  const idea = String(data.get("idea") || "a new reading circle").trim();
  formNote.textContent = `${name}, your idea "${idea}" is saved for the workshop demo.`;
  signupForm.reset();
});
