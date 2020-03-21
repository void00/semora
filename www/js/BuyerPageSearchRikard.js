class BuyerPageSearchRikard extends Base {

  async mount() {
    // Populate region-dropdown
    this.regionSelection = await sql(/*sql*/`SELECT * FROM region ORDER BY region.regionName`);

    this.formInput = new FormData();
  }


  async doSearch() {

    // If null the page hasn't been rendered or form hasn't been submitted yet then load a default result
    if (document.querySelector('[id="buyerSearchForm2"]') === null) {

      app.buyerPageRikard.searchResult = await sql(/*sql*/`
        SELECT * FROM 
          realEstateInfo,
          userXregion ON realEstateInfo.userId = userXregion.userId,
          region ON region.id = userXregion.regionId,
          realEstateAddress ON realEstateAddress.realEstateId = realEstateInfo.Id,
          areaInfo ON areaInfo.id = realEstateInfo.areaInfoId,
          realEstateImages ON realEstateImages.realEstateInfoId = realEstateInfo.Id
          WHERE imgUrl LIKE '%img01%'
          AND CAST(realEstateInfo.price AS int) < '999999999'    
          AND CAST(realEstateInfo.rooms AS int) >= '0'
          AND CAST(realEstateInfo.area AS int) >= '0'
          GROUP BY realEstateInfo.Id`);

    }
    else {

      this.formInput = document.querySelector('[id="buyerSearchForm2"]');

      app.buyerPageRikard.searchResult = await sql(/*sql*/`
        SELECT * FROM 
          realEstateInfo,
          userXregion ON realEstateInfo.userId = userXregion.userId,
          region ON region.id = userXregion.regionId,
          realEstateAddress ON realEstateAddress.realEstateId = realEstateInfo.Id,
          areaInfo ON areaInfo.id = realEstateInfo.areaInfoId,
          realEstateImages ON realEstateImages.realEstateInfoId = realEstateInfo.Id
        WHERE imgUrl LIKE '%img01%'
        AND CAST(realEstateInfo.price AS int) < $maxprice   
        AND CAST(realEstateInfo.rooms AS int) >= $minrooms
        AND CAST(realEstateInfo.area AS int) >= $minarea
        AND CASE
          WHEN CAST($regionid AS Int) < 1 THEN (region.id > 0)
          ELSE region.id = CAST($regionid AS Int)
        END
        AND CASE
          WHEN $textinput != '' THEN (
            realEstateInfo.description LIKE $textinput
            OR realEstateInfo.tenure LIKE $textinput
            OR realEstateAddress.streetName LIKE $textinput
            OR region.regionName LIKE $textinput
            OR areaInfo.description LIKE $textinput
            )
        END
        AND CASE WHEN $opt1 THEN realEstateInfo.tenure LIKE '%' END
        OR CASE WHEN $opt2 THEN realEstateInfo.tenure = 'Villa' END
        OR CASE WHEN $opt3 THEN realEstateInfo.tenure = 'Radhus' END
        OR CASE WHEN $opt4 THEN realEstateInfo.tenure = 'Lägenhet' END
        OR CASE WHEN $opt5 THEN realEstateInfo.tenure = 'Fritidshus' END
        OR CASE WHEN $opt6 THEN realEstateInfo.tenure = 'Gård' END
        OR CASE WHEN $opt7 THEN realEstateInfo.tenure = 'Tomt' END
        OR CASE WHEN $opt8 THEN realEstateInfo.tenure = 'Övrig' END
        GROUP BY realEstateInfo.Id
        `,
        {
          textinput: '%' + this.formInput.textinput.value + '%',
          regionid: this.formInput.regionselect.value,
          maxprice: this.formInput.maxprice.value,
          minarea: this.formInput.minarea.value,
          minrooms: this.formInput.minrooms.value,
          opt1: this.formInput.tenureOption1.checked,
          opt2: this.formInput.tenureOption2.checked,
          opt3: this.formInput.tenureOption3.checked,
          opt4: this.formInput.tenureOption4.checked,
          opt5: this.formInput.tenureOption5.checked,
          opt6: this.formInput.tenureOption6.checked,
          opt7: this.formInput.tenureOption7.checked,
          opt8: this.formInput.tenureOption8.checked
        });

    }

    // Refresh result page (BuyerPage)
    app.buyerPageRikard.render();

  }


  // Real estate tenure checkboxes behaviour. Sets true/false and active. Ugly code fix later /Rikard
  checkBoxes(e) {
    this.boxes = document.getElementsByClassName('tenure-checkbox');

    if (e.target.attributes.name.value === 'uncheck') {
      for (let box of this.boxes) {
        if (box.name.value === 'tenureOption1') {
          this.boxes.tenureOption1.checked = true;
          this.boxes.tenureOption1.parentElement.classList.toggle('active');
          continue;
        }
        box.checked = false;
        box.parentElement.classList.remove('active');
      }
    }
    else {
      this.boxes.tenureOption1.checked = false;
      this.boxes.tenureOption1.parentElement.classList.remove('active');
      e.target.checked ? e.target.checked = false : e.target.checked = true;
      e.target.parentElement.classList.toggle('active');
    }

  }



  // Addition by Thomas
  preventPageReload(e) {
    // Do not perform a hard reload of the page when someone submits the form
    e && e.preventDefault();
  }




  render() {
    // No seaarch result are present do a default search
    app.buyerPage.searchResult.length < 1 ? this.doSearch() : '';
    return /*html*/`
      <div class="row m-0" route="/testpage" page-title="Testsida">
        <div class="col p-4">

          <div class="row p-2">
            <div class="col text-center">
              <p>Rikards lekstuga där jag testar lite!</p>
              <h1>Sök drömbostaden...</h1>
            </div>
          </div>

            <form id="buyerSearchForm2" submit="preventPageReload">
            <div class="form-group p-4">

              <div class="row">
                <div class="col">
                  <!-- <label for="keywordsInput">Område</label> -->
                  </div>
              </div>

              <div class="row pb-2">
                <div class="col-md mt-4">
                  <input type="text" class="form-control rounded mr-4 form-control-lg" placeholder="Skriv område, adress eller nyckelord..." name="textinput" autocomplete="on" autocorrect="off">
                  </div>
                  <div class="col-auto mt-4">
                    <select class="form-control form-control-lg" id="region_select" name="regionselect">
                      <option value="0">Alla regioner</option>
                      ${this.regionSelection.map(region => '<option value="' + region.id + '">' + region.regionName + '</option>')}
                    </select>
                  </div>
                  <div class="col-auto mt-4">
                    <button class="btn btn-light btn-lg" style="background-color: #ffe034; width: 10rem" click="doSearch" type="submit">Sök</button>
                  </div>
                </div>

                <hr>

                  <div class="row-auto pt-2">
                    <div class="btn-group-toggle" data-toggle="buttons">

                      <div class="row">
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block active" click="checkBoxes" name="uncheck" style="white-space: nowrap"><input class="tenure-checkbox" type="checkbox" name="tenureOption1" id="allatyper" checked="true">Alla typer</label>
                        </div>
                          <div class="col px-1 mx-0">
                            <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption2" id="villor">Villor</label>
                        </div>
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption3" id="radhus">Radhus</label>
                        </div>
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption4" id="lagenheter">Lägenheter</label>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption5" id="fritidshus">Fritidshus</label>
                        </div>
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption6" id="gardar">Gårdar</label>
                        </div>
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption7" id="tomter">Tomter</label>
                        </div>
                        <div class="col px-1 mx-0">
                          <label class="btn btn-light btn-block" click="checkBoxes" name="check"><input class="tenure-checkbox" type="checkbox" name="tenureOption8" id="ovriga">Övriga</label>
                        </div>
                      </div>

                    </div>
                  </div>

                  <hr>

                  <div class="row">
                    <div class="col">
                      <label for="min_rooms">Minst antal rum</label>
                    </div>
                    <div class="col">
                      <label for="min_area">Boarea</label>
                    </div>
                    <div class="col">
                      <label for="max_price">Högst pris</label>
                    </div>
                  </div>

                  <div class="row">

                    <div class="col">
                      <select class="form-control" id="min_rooms" name="minrooms">
                        <option value="0">Alla</option>
                        <option value="1">Minst 1 rum</option>
                        <option value="2">Minst 2 rum</option>
                        <option value="3">Minst 3 rum</option>
                        <option value="4">Minst 4 rum</option>
                        <option value="5">Minst 5 rum</option>
                        <option value="10">Minst 10 rum</option>
                      </select>
                    </div>

                    <div class="col">
                      <select class="form-control" id="min_area" name="minarea">
                        <option value="0">Alla</option>
                        <option value="20">Minst 20 m²</option>
                        <option value="30">Minst 30 m²</option>
                        <option value="40">Minst 40 m²</option>
                        <option value="50">Minst 50 m²</option>
                        <option value="75">Minst 75 m²</option>
                        <option value="100">Minst 100 m²</option>
                        <option value="125">Minst 125 m²</option>
                        <option value="150">Minst 150 m²</option>
                        <option value="175">Minst 175 m²</option>
                        <option value="200">Minst 200 m²</option>
                        <option value="250">Minst 250 m²</option>
                        <option value="300">Minst 300 m²</option>
                        <option value="350">Minst 350 m²</option>
                        <option value="450">Minst 450 m²</option>
                        <option value="500">Minst 500 m²</option>
                      </select>
                    </div>

                    <div class="col">
                      <select class="form-control" id="max_price" name="maxprice">
                        <option value="999999999">Inget</option>
                        <option value="100000">100 000 kr</option>
                        <option value="200000">200 000 kr</option>
                        <option value="300000">300 000 kr</option>
                        <option value="400000">400 000 kr</option>
                        <option value="500000">500 000 kr</option>
                        <option value="700000">750 000 kr</option>
                        <option value="1000000">1 000 000 kr</option>
                        <option value="1250000">1 250 000 kr</option>
                        <option value="1500000">1 500 000 kr</option>
                        <option value="1750000">1 750 000 kr</option>
                        <option value="2000000">2 000 000 kr</option>
                        <option value="2500000">2 500 000 kr</option>
                        <option value="3000000">3 000 000 kr</option>
                        <option value="3500000">3 500 000 kr</option>
                        <option value="4000000">4 000 000 kr</option>
                        <option value="4500000">4 500 000 kr</option>
                        <option value="5000000">5 000 000 kr</option>
                        <option value="5500000">5 500 000 kr</option>
                        <option value="6000000">6 000 000 kr</option>
                        <option value="7000000">7 000 000 kr</option>
                        <option value="8000000">8 000 000 kr</option>
                        <option value="9000000">9 000 000 kr</option>
                        <option value="10000000">10 000 000 kr</option>
                        <option value="11000000">11 000 000 kr</option>
                        <option value="12000000">12 000 000 kr</option>
                        <option value="13000000">13 000 000 kr</option>
                        <option value="14000000">14 000 000 kr</option>
                        <option value="15000000">15 000 000 kr</option>
                        <option value="20000000">20 000 000 kr</option>
                        <option value="25000000">25 000 000 kr</option>
                      </select>
                    </div>

                  </div>

            </div>
            </form>

        </div>
      </div>
    `;
  }

}
