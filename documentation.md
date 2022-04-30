# Dokumentaatio - eKuittilompakko backend

## Ohjelman toiminnot konsolista
  - yarn install - asenna riippuvuudet
  - yarn run dev - käynnistä kehitysympäristö
  - yarn run build - luo tuotantoversio koonti
  - yarn run start - käynnistä tuotantoversio
  - yarn run test - käynnistä testiympäristö
  - yarn run lint - testaa koodin yhtenevyyttä

> Luo oma .env tiedosto projektin juureen ennen ennen kuin ajat ohjelmaa

> Backendin toimintaa voi kokeilla lokaalisti selaimesta:

http://localhost:[porttinumero]/api/receipts/test

ja

http://localhost:[porttinumero]/api/receipts

## Tietokanta: Azure CosmosDB

Ohjelmisto käyttää tietokantana Azure pilvipalvelun CosmosDB tietokantaa.

Vaatimukset tietokantayhteyden käytölle
1. Ohjelmistoa käyttävällä taholla tulee olla käytössä oma Azure tili.
2. Azure tilille tulee luoda uusi resource-group (Tämän nimellä ei ole väliä).
3. Resource-groupissa tulee ottaa käyttöön Cosmos DB tili (Resource groupin voi myös luoda Cosmos DB tilin luomisen yhteydessä).
4. Cosmos DB tilin DB_URI ja SECRET_KEY tulee tallettaa .env tiedostoon. Ohjeet tämän tiedoston lopussa.
5. Tietokantojen ja containereiden nimet voi halutessaan päivittää src/utils/config.ts tiedostoon tai jättää alkuarvoisiksi. Ohjelma luo nämä resurssit cosmos DB tilille käynnistyessään, tai ottaa niihin yhteyden jos ne ovat jo olemassa.
6. Testaamista varten pitää samaan resource-grouppiin lisätä myös toinen Cosmos DB tili. Tämän TEST_DB_URI ja TEST_SECRET_KEY tulee myös päivittää .env tiedostoon.

> Sovelluksen käynnistäminen luo tietokannat ja containerit annetuilla nimillä. Jos kyseisen nimiset tietokannat ja containerit löytyvät jo Cosmos DB tilitä, sovellus vain yhdistää niihin.

> Tietokannan toimintaa voi kokeilla ajamalla kutsuja src/requests kansiosta löytyvistä .rest tiedostoista.

> Suuremmat testit voi ajaa "yarn run test" komennolla joka ottaa yhteyden testaus tietokantaan.

### Tietokantayhteyksien arkkitehtuuri

> app.ts tiedostoon kirjataan ylemmän tason api endpointit kuten '/api/tasks' ja sille liitetään oma router kuten 'taskRouter'

> utils/dao.ts sisältää tietokannan ja containereiden luontiin tarkoitetut funktiot. app.ts suorittaa nämä toiminnot init funktion kautta.

> jokaiselle routerille on oma tiedostonsa src/controllers kansiossa. Tänne talletetaan alemman tason API endpointit sekä CRUD menetelmät joilla niitä kutsutaan.

> routerit tarvitsevat tietokantayhteyksien luomiseen ja hallinnointiin apumetodeja joita säilytetään src/models kansiossa. Jokaiselle tietokanta-routerille on oma model aputiedosto.

> config.ts sisältää tietokantojen ja containereiden käyttämät nimet. Sovelluksen käynnistyessä se myös määrittelee mitä tietokantayhteyttä käytetään. Testitilanteessa käytetään eri Cosmos DB tiliä.

## Backendin struktuuri

Osa-alueet:
  - Struktuurin kuvaus
  - Struktuurin selitykset
  - .env vaadittu sisältö

#### Struktuurin kuvaus
```

├── dist
│   └── ...
├── docs
│   └── ...
├── src
│   ├── controllers
│   │   ├── tasks.ts
│   │   ├── receipts.ts
│   │   └── ...
│   ├── models
│   │   ├── taskDao.ts
│   │   ├── receipt.ts
│   │   ├── receiptDao.ts
│   │   └── ...
│   ├── utils
│   │   ├── config.ts
│   │   ├── dao.ts
│   │   ├── logger.ts
│   │   ├── middleware.ts
│   │   └── ...
│   ├── requests
│   │   └── ...
│   ├── app.ts
│   ├── index.ts
├── .env (hidden)
├── ...

Tests kansio lisätään myöhemmin
```

#### Struktuurin selitykset
- dist - Kansioon valmistuu backending koonti.
  - yarn run build -komento luo tuotanto palvelin koonnin
  - yarn run start -komento käynnistää tuotantopalvelimen

- docs - Kansioon voi tallentaa erinäistä dokumentaatio tukemaan kehitystä

- src - Kansio sisältää kaiken backendin toiminnallisuuden

- controllers - Kansio sisältää eri api osoitteiden routerit

- tasks.ts - Esimerkki router jossa CRUD operaatiot kohdistuvat tietokantaan (Delete later)

- receipts.ts - Router joka yhdistää URL API endpointit model luokassa määriteltyihin CRUD tietokanta operaatioihin

- models - Kansio sisältää routereiden apumetodit jotka käyttävät tietokanta yhteyksiä

- taskDao.ts - Esimerkki model josta löytyy tasks.ts tiedostossa käytetyt tietokanta apumetodit (Delete later)

- receipt.ts - Model josta löytyy kuittien sisällön määrittely typescriptin type oliona

- receiptDao.ts - Model josta löytyy receipts.ts tiedostossa käytetyt tietokanta CRUD operaatiot

- utils - Kansio joka sisältää ohjelman aputiedostot

- requests - Kansio sisältää REST tyylisiä kutsuja joilla voi testata tietokannan toimivuutta

- config.ts - Määrittelee ulospäin menevät yhteydet .env tiedoston avulla

- dao.ts - Sisältää tietokantayhteyden luontiin tarvittavat metodit. Luo uudet tietokannat ja containerit ellei niitä jo ole olemassa.

- logger.ts - Luo info ja error logit joita voi käyttää console.log sijaan

- middleware.ts - Sisältää apuominaisuuksia jotka reagoivat apikutsuihin ja niiden onnistumiseen

- app.ts - Yhdistää sovelluksen eri toiminnallisuudet
  - Luo yhteyden tietokantaan
  - ottaa käyttöön middlewaret
  - luo api polut ja liittää niihin tarvittavan routerin

- index.ts - Luo ja käynnistää sovelluspalvelimen

- .env - Tämä tiedosto tulee jokaisen kehittäjän itse luoda, sisältää mahdollisesti salaista tietoa
  - Alla on tarkemmat ohjeet .env-tiedoston vaaditulle sisällölle

#### Sisältö .env tiedostolle

```

PORT="<valittu portti johon sovelluspalvelin käynnistyy, esim 8000>"

DB_URI="<verkko-osoite Azure Cosmos DB tilille>"

DB_SECRET_KEY="<salainen avain jota tarvitaan tietokanta yhteyden avaamiseen>"

TEST_DB_URI="<verkko-osoite Azure Cosmos DB testaus tilille>"

TEST_DB_SECRET_KEY="<salainen avain testaustilille>"

```

