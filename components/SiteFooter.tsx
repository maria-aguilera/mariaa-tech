import Icon from "@/components/Icon";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <a
          className="bmcBtn site-footer__bmc"
          href="https://buymeacoffee.com/mariaaguilera"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="coffee" aria-hidden="true" />
          <span>Buy Me a Coffee</span>
        </a>
        <p className="site-footer__note">&copy; 2026 Maria Aguilera. All opinions are my own.</p>
      </div>
    </footer>
  );
}
