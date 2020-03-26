class AgentsPage extends Base {

  async mount() {

    this.selectedRegion = 0;

    //pop agents
    this.regionSelection = await sql(/*sql*/`
    SELECT * FROM region`);

    this.foundAgents = await sql(/*sql*/`
    SELECT user.firstName,  user.lastName, user.id,
    user.phone, user.email, user.description, user.imageUrl,
    GROUP_CONCAT(region.regionName,', ') region_names
    FROM userXregion 
    INNER JOIN user ON user.id = userXregion.userId, 
    region ON region.id = userXregion.regionId
    WHERE user.isAgent = 'true'
    GROUP BY user.id
    `);
    this.render();
  }

  async searchAgentRegions(e) {

    this.selectedRegion = parseInt(e.target.value);

    this.foundAgents = await sql(/*sql*/`
      SELECT user.firstName,  user.lastName, user.id,
      user.phone, user.email, user.description, user.imageUrl,
      GROUP_CONCAT(region.regionName,', ') region_names
      FROM userXregion 
      INNER JOIN user ON user.id = userXregion.userId, 
      region ON region.id = userXregion.regionId
      WHERE user.isAgent = 'true'
      ${this.selectedRegion > 0 ? ('AND userXregion.regionId = ' + this.selectedRegion) : ''}
      GROUP BY user.id
    `);
    this.render();

  }




  render() {
    return /*html*/`
      <div class="row m-0" route="/real-estate-agents" page-title="Dhyr & Rumson - Våra mäklare">
        <div class="container m-1 p-2">

          <div class="row m-0">
            <div class="col-12 m-0 p-2"><h5></h5>
              <p>Kunskap och erfarenhet är tillgångar i alla yrken.</p>
              <p>Till Dhyr & Rumson har vi därför handplockat endast dom som heter son i efternamn och de skickligaste och mest erfarna mäklarna i Stockholm.
                  Vi har gjort det av en enda anledning för att dom HETER SON i efternamn alltid – så att rätt person kan företräda dig i din kanske största affär.</p>
              
                  <select class="form-control form-control-lg" change="searchAgentRegions" id="region_select" name="regionselect">
                  <option value="0">Alla regioner</option>
                  ${this.regionSelection.map(region => '<option value="' + region.id + '" ' + (this.selectedRegion > 0 && region.id === this.selectedRegion ? 'selected' : '') + '>' + region.regionName + '</option>')}
                  </select>
              
              <div class="row p-3 border bg-warning no-gutters">
                ${this.foundAgents.map(user => /*html*/`
                  <div class="mb-3 col-md-4 pl-3 col-sm-12 col-lg-2 bg-info" >
                    <a href="/real-estate-agent/${user.id}">
                    <img src="images/${user.imageUrl}" targetbrokerid="${user.id}" class="img-thumbnail img-fluid rounded" alt="Agent face ${user.lastName}"></a>
                  </div>
                  <div class="card-body col-sm-12 col-md-8 col-lg-4 p-3 bg-bg-danger ">
                    <div class="card-title name-nopad">
                      <a href="/real-estate-agent/${user.id}">
                      <p class="name-nopad name-bold">${user.firstName} ${user.lastName}</p></a>   
                    </div>
                    <div class="card-text  bg-success">            
                    
                      <p class="card-text broker-info  name-email-phone"><span class="d-flex name-bold">E-Mail:</span>  ${user.email}</p>
                      <p class="card-text broker-info  name-email-phone"><span class="name-bold">Tel:</span>  ${user.phone.toString().replace(/\B(?=(\d{3})+(\d{4})+(?!\d))/g, " ")}</p>
                      <p class="card-text broker-info  name-region"><span class="name-bold">Region:</span> ${user.region_names}.</p>
                      <hr class="mb-5">
                    </div>
                  </div>                
                `)}
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
  }

}