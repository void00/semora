class BuyerPage extends Base {

  async mount() {
    this.foundKeywords = [];
    this.selected = -1;
  }

  clickKeyword(e) {
    this.foundKeywords = [];
    this.selected = -1;
    this.chosen = e.target.innerText;
    this.render();
  }

  selectWithUpDownArrows(e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      this.selected += (e.key === 'ArrowDown') - (e.key === 'ArrowUp');
      if (this.selected < 0) { this.selected = this.foundKeywords.length - 1; }
      if (this.selected >= this.foundKeywords.length) { this.selected = 0; }
      this.render();
      return;
    }
  }
  async searchKeyword(e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) { return; }

    if (e.key === 'Enter' && this.selected >= 0) {
      this.chosen = this.foundKeywords[this.selected];
      this.foundKeywords = [];
      this.selected = -1;
      this.render();
      return;
    }
    this.selected = 0;
    this.foundKeywords = e.target.value.length < 1 ? [] : await sql(/*sql*/`SELECT regionName,price, tenure, area FROM realEstateInfo
    realEstate inner JOIN userXregion userReg ON
    realEstate.userId  = userReg.userId
    inner JOIN region r on
    r.id = userReg.regionId 
    AND r.regionName LIKE $text`, { text: e.target.value + '%' });
    this.render();
  }
  render() {
    return /*html*/`
        <div class="row m-0" route="/buy-property" page-title="Köpa bostad">
        <div class="col-12">
        <h1>Köpa Bostad </h1>
        <div class="active-pink-3 active-pink-4 mb-4">
          <input class="form-control" type="text" placeholder="Snabbsök bostad här..." aria-label="Search" keyup="searchKeyword" keydown="selectWithUpDownArrows" autocomplete="off" autocorrect="off">
            ${this.foundKeywords.length < 1 ? '' : /*html*/`
            ${this.foundKeywords.map((keywords, index) => /*html*/`
            <div class="col-4"><p>${foundKeywords.rooms}` + ' ' + `${foundKeywords.price}</p><p>${foundKeywords.tenure}</p><p>${foundKeywords.area}</p></div>)} </div>               
                                  
                  `)}
  }

  `}
        </div>
        <p>Sökfilter</p>
        <h2>Resultatlista</h2> 
      </div >
      </div >
      `
  }

}