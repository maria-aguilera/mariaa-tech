const BUY_ME_COFFEE_URL = "https://www.buymeacoffee.com/your-handle";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <a className="coffee-btn" href={BUY_ME_COFFEE_URL} target="_blank" rel="noreferrer">
          <i data-lucide="coffee" aria-hidden="true" />
          <span>Buy Me a Coffee</span>
        </a>

        <p className="site-footer__note">&copy; 2025 Maria Aguilera. All opinions are my own.</p>
      </div>
    </footer>
  );
}
