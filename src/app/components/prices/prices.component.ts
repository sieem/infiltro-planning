import { Component } from '@angular/core';

@Component({
  selector: 'app-prices',
  template: `
    <div class="wrapper">
      <h1>Nieuwe offertes - verkoopprijzen naar Klant</h1>
      <h2>Eengezinswoningen</h2>
      <table>
        <thead>
          <tr>
            <th>Van</th>
            <th>Tot</th>
            <th>Forfait</th>
            <th>Per Wooneenheid</th>
            <th>Conformiteit (AICB)/stuk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>€ 170,00</td>
            <td>€ 125,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>3</td>
            <td>4</td>
            <td>€ 170,00</td>
            <td>€ 120,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>5</td>
            <td>9</td>
            <td>€ 170,00</td>
            <td>€ 115,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>10</td>
            <td>14</td>
            <td>€ 170,00</td>
            <td>€ 110,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>15</td>
            <td>19</td>
            <td>€ 170,00</td>
            <td>€ 105,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>20</td>
            <td>50</td>
            <td>€ 170,00</td>
            <td>€ 100,00</td>
            <td>€ 32,00</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>>50</td>
            <td>€ 170,00</td>
            <td>€ 95,00</td>
            <td>€ 32,00</td>
          </tr>
        </tbody>
      </table>

      <h2>Extra eengezinswoningen</h2>
      <table>
        <tbody>
          <tr>
            <th>Door grootte</th>
            <td>€ 125,00</td>
            <td>Extra per ventilator</td>
          </tr>
          <tr>
            <th>Door EPB eenheid</th>
            <td>€ 25,00</td>
            <td>Extra per EPB eenheid</td>
          </tr>
        </tbody>
      </table>

      <h2>Meergezinswoningen</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Forfait per fase</th>
            <th>Per test</th>
            <th>Per wooneenheid</th>
            <th>Conformiteit (AICB)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test per traphal</td>
            <td>€ 170,00</td>
            <td>€ 125,00</td>
            <td>€ 25,00</td>
            <td>Volgens verliesoppervlak/volume</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Tarieven SKH vanaf 1/10/2018</td>
          </tr>
        </tbody>
      </table>

      <h2>Andere (kantoren/WZC/scholen/openbare gebouwen, ....)</h2>

      <table>
        <thead>
          <tr>
            <th>Van</th>
            <th>Tot</th>
            <th>Forfait</th>
            <th>Per Ventilator</th>
            <th>Conformiteit (AICB)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>4</td>
            <td>€ 250,00</td>
            <td>€ 150,00</td>
            <td>Volgens tarief AICB of BCCA</td>
          </tr>
          <tr>
            <td>4</td>
            <td>6</td>
            <td>€ 300,00</td>
            <td>€ 175,00</td>
            <td>Volgens tarief AICB of BCCA</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>> dan 6</td>
            <td>&nbsp;</td>
            <td>Per project</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2>Berekening aantal ventilatoren</h2>
      <p>
        max 7000 m3 per ventilator<br>
        vb: 2000 m2 verliesoppervlak en een max v50 van 6 m3/h.m2= 12000 m2, dus 2 ventilatoren
      </p>

      <h2>Verduidelijkingen:</h2>
      <p>
        Eén forfait wordt aangerekend per adres of reeks van testen in zelfde project/fase. De wooneenheden moeten wel samen
        aangeboden worden.<br>
        Conformiteitsverklaringen worden één op één doorgerekend, aan de voordeligste prijs (meetal AICB).<br>
      </p>
      <h2>Werfbezoeken</h2>
      <p>
        Voor werfbezoeken en deelname aan werfvergaderingen wordt een forfaitaire vergoeding van 200 euro (ex BTW)
        aangerekend.
        Voor de provincies West-Vlaanderen en Luxemburg wordt deze forfaitaire vergoeding met 50 euro (ex BTW) verhoogd.
      </p>
      <h2>Extra's</h2>
      <p>Op vraag van de klant wordt voor weekend- en avondwerk (starten na 17 uur) een extra vergoeding van 150 euro aangerekend.</p>
    </div>
  `,
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent {
  constructor() { }
}
