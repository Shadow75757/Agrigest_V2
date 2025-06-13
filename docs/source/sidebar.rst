Sidebar.jsx
==========

Sidebar Component
-----------------

This module exports the `Sidebar` functional component which renders the sidebar navigation menu.

Sidebar
~~~~~~~~

- Displays the application logo with an icon and title.
- Contains navigation links to different app sections:
  - Dashboard
  - Localizações
  - Análises
  - Histórico
  - Configurações
- Each navigation link includes an icon and text label.
- The active link is highlighted using the `active` CSS class.

Usage example::

  import Sidebar from './Sidebar';

  function App() {
    return (
      <Sidebar />
    );
  }
