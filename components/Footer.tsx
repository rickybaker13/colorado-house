export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold font-display mb-4">San Juans</h3>
            <p className="text-accent-sky">
              Discover the alpine beauty of Colorado's San Juan Mountains.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-display mb-4">Quick Links</h4>
            <ul className="space-y-2 text-accent-sky">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/purgatory-resort" className="hover:text-white transition">Resort</a></li>
              <li><a href="/needles-mountains" className="hover:text-white transition">Needles</a></li>
              <li><a href="/experience" className="hover:text-white transition">Experience</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-display mb-4">Contact</h4>
            <p className="text-accent-sky">
              Durango, CO 81301<br />
              San Juan Mountains<br />
              Colorado, USA
            </p>
          </div>
        </div>
        <div className="border-t border-accent-slate pt-8 text-center text-accent-sky">
          <p>&copy; 2024 Purgatory Area. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
