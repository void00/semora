class App extends Base {

  async mount() {

    await sql(/*sql*/`USE DhyrRumson.db`);

    this.navBarLinks = [
      { label: 'Köpa bostad', route: '/buy-property' },
      //{ label: 'En bostad', route: '/real-estate-info' },
      { label: 'Sälja bostad', route: '/our-regions' },
      { label: 'Våra mäklare', route: '/real-estate-agents' },
      { label: 'Bostad info', route: '/real-estate-info' },
      { label: 'Om oss', route: '/about-us' },

    ];
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.navBarSearch = new NavBarSearch();
    this.heroSection = new HeroSection();
    this.footer = new Footer();
    this.startPage = new StartPage();
    this.buyerPage = new BuyerPage();
    this.sellerPage = new SellerPage();
    this.agentsPage = new AgentsPage();
    //this.objectsPage = new ObjectsPage();
    this.mapsPage = new MapsPage();
    this.aboutUsPage = new AboutUsPage();
    this.missingPage = new MissingPage();

    this.testPage = new TestPage({ realEstateId: '' });
    this.agentPage = new AgentPage({ targetBrokerId: '24' });
    this.objectsPage = new ObjectsPage({ targetBostadId: '2' });

  }

  render() {
    return /*html*/`
      <div class="container main-wrapper pl-0 pr-0" base-title="Dhyr & Rumson: ">
        <header>
          ${this.heroSection}
          ${this.navBar}
          <!-- Keep navBarSearch after navBar -->
          ${this.navBarSearch}
        </header>
        <main>
          ${this.startPage}
          ${this.buyerPage} 
          ${this.sellerPage}
          ${this.agentsPage}
          ${this.objectsPage}
          ${this.mapsPage}
          ${this.aboutUsPage}
          ${this.missingPage}
          ${this.testPage}
          ${this.agentPage}

        </main>
        ${this.footer}
      </div>
    `;
  }

}