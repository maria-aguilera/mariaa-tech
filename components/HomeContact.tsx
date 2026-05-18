import Image from "next/image";
import Icon from "@/components/Icon";

const CONTACT_EMAIL = "mailto:mariaaguilera979797@gmail.com";

export default function HomeContact() {
  return (
    <section className="contact" aria-label="Get in touch">
      <div className="contact__container">
        <article className="contact-card">
          <div className="contact-card__content">
            <h2 className="contact-card__title">
              <Icon name="message-circle" aria-hidden="true" />
              <span>Get In Touch</span>
            </h2>

            <p className="contact-card__summary">
              Interested in collaboration, speaking opportunities, or discussing AI?
            </p>

            <a className="contact-card__cta" href={CONTACT_EMAIL}>
              <Icon name="mail" aria-hidden="true" />
              <span>Contact</span>
            </a>
          </div>

          <div className="contact-card__media">
            <Image
              src="/contact-media.svg"
              alt="Speaker on stage"
              width={900}
              height={700}
              sizes="(min-width: 900px) 40vw, 90vw"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
