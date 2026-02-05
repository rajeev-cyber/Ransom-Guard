import React from 'react'

const footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-400/50 bg-white dark:bg-slate-900/50 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="items-center justify-items-center grid grid-cols-5 gap-8">
            <div>
              <h4 className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-4">Our Product</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Get Support</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">How it works</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">ToS | Privacy Notice</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog Release</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-4">Community</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Join Community</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Vote and Comment</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contributors</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Top Users</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Community Buzz</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-4">Tools</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">API Scripts</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">YARA</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Desktop Apps</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Browser Extensions</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-4">Premium Services</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Get a demo</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Intelligence</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Graph</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Hunting</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">API v3|v2</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-4">Docs</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Searching</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Reports</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">API v3|v2</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Use Cases</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-400/20 text-center">
            <p className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-xs transition-colors">
              © 2026 Ransom-Guard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default footer
