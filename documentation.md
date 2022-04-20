# Dokumentaatio - eKuittilompakko backend

## Ohjelman toiminnot konsolista
  - yarn install - asenna riippuvuudet
  - yarn run dev - käynnistä kehitysympäristö
  - yarn run build - luo tuotantoversio koonti
  - yarn run start - käynnistä tuotantoversio
  - yarn run test - käynnistä testiympäristö (ei vielä toiminnassa)

> Luo oma .env tiedosto projektin juureen ennen ennen kuin ajat ohjelmaa

> Backendin toimintaa voi testata lokaalisti selaimesta:

http://localhost:[porttinumero]/api/hello

http://localhost:[porttinumero]/api/hello/[nimesitähän]


## Tietokanta: Azure CosmosDB

Ohjelmisto käyttää tietokantana Azure pilvipalvelun CosmosDB tietokantaa.

Vaatimukset tietokantayhteyden käytölle
1. Ohjelmistoa käyttävällä taholla tulee olla käytössä oma Azure tili.
2. Azure tilille tulee luoda uusi resource-group (Tämän nimellä ei ole väliä).
3. Resource-grouping sisälle tulee luoda oma Cosmos DB tietokanta.
4. Tietokannan sisälle tulee luoda uusi Container.
5. Tietokannan nimi ja Containerin nimi tulee päivittää src/utils/config.ts tiedostoon.
6. Tietokannan osoite ja salainen avain tulee lisätä .env tiedostoon. Ohjeet ovat tämän dokumentin lopussa.

> Tietokannan toimintaa voi tällä hetkellä testata src/requests kansiosta löytyvillä .rest tiedostoilla.

### Tietokantayhteyksien arkkitehtuuri

> app.ts tiedostoon kirjataan ylemmän tason api endpointit kuten '/api/tasks' ja sille liitetään oma router kuten 'taskRouter'

> jokaiselle routerille on oma tiedostonsa src/controllers kansiossa. Tänne talletetaan alemman tason API endpointit sekä CRUD menetelmät joilla niitä kutsutaan.

> routerit tarvitsevat tietokantayhteyksien luomiseen ja hallinnointiin apumetodeja joita säilytetään src/models kansiossa. Jokaiselle tietokanta-routerille on oma model aputiedosto.

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
│   │   ├── hello.ts
│   │   ├── tasklist.ts
│   │   └── ...
│   ├── models
│   │   ├── taskDao.ts
│   │   └── ...
│   ├── utils
│   │   ├── config.ts
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

- hello.ts - Esimerkki router joka määrittelee CRUD operaatiot kyseiselle api-osoitteelle

- tasklist.ts - Esimerkki router jossa CRUD operaatiot kohdistuvat tietokantaan

- models - Kansio sisältää routereiden apumetodit jotka käyttävät tietokanta yhteyksiä

- taskDao.ts - Esimerkki model josta löytyy tasklist.ts tiedostossa käytetyt tietokanta apumetodit

- utils - Kansio joka sisältää ohjelman aputiedostot

- requests - Kansio sisältää REST tyylisiä kutsuja joilla voi testata tietokannan toimivuutta

- config.ts - Määrittelee ulospäin menevät yhteydet .env tiedoston avulla

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

PORT="<valittu portti, esim 8000>"

DB_URI="<verkko-osoite tietokantaan jota käytetään tuotannossa/kehityksessä>"

DB_SECRET_KEY="<salainen avain jota tarvitaan tietokanta yhteyden avaamiseen>"

TEST_DB_URI="<verkko-osoite tietokantaan jota käytetään testeissä/kehityksessä>"

```

