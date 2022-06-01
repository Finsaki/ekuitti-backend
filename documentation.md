# Dokumentaatio - eKuittilompakko backend

## Ohjelman toiminnot konsolista
  - **yarn install** - asenna riippuvuudet
  - **yarn run dev** - käynnistä kehitysympäristö
  - **yarn run build** - luo tuotantoversio koonti
  - **yarn run start** - käynnistä tuotantoversio
  - **yarn run test** - käynnistä testiympäristö (Ei vielä toiminnassa!!!)
  - **yarn run lint** - testaa koodin yhtenevyyttä

> Luo oma **.env** tiedosto projektin juureen ennen ennen kuin ajat ohjelmaa

> Backendin toimintaa voi kokeilla lokaalisti selaimesta:

http://localhost:8080/api/receipts/test

> ja tietokanta yhteyttä käyttäen:

http://localhost:8080/api/receipts

> Porttinumero on oletuksena 8080 mutta sen voi vaihtaa **.env** tiedostoon halutessaan. Ohjeet tämän tiedoston lopussa.

## Tietokanta: Azure CosmosDB

Ohjelmisto käyttää tietokantana Azure pilvipalvelun CosmosDB tietokantaa.

Vaatimukset tietokantayhteyden käytölle
1. Ohjelmistoa käyttävällä taholla tulee olla käytössä oma Azure tili.
2. Azure tilille tulee luoda uusi resource-group (Tämän nimellä ei ole väliä).
3. Resource-groupissa tulee ottaa käyttöön Cosmos DB tili (Resource groupin voi myös luoda Cosmos DB tilin luomisen yhteydessä).
4. Cosmos DB tilin **DEV_DB_URI** ja **DEV_SECRET_KEY** tulee tallettaa **.env** tiedostoon. Ohjeet tämän tiedoston lopussa.
5. Tietokantojen ja containereiden nimet voi halutessaan päivittää [config.ts](src/utils/config.ts) tiedostoon tai jättää alkuarvoisiksi. Ohjelma luo nämä resurssit cosmos DB tilille käynnistyessään, tai ottaa niihin yhteyden jos ne ovat jo olemassa.
6. Tuotantoa varten pitää samaan resource-grouppiin lisätä myös toinen Cosmos DB tili. Tämän **PROD_DB_URI** ja **PROD_SECRET_KEY** tulee myös päivittää **.env** tiedostoon.

> Sovelluksen käynnistäminen luo tietokannat ja containerit [config.ts](src/utils/config.ts) tiedostossa annetuilla nimillä. Jos kyseisen nimiset tietokannat ja containerit löytyvät jo Cosmos DB tilitä, sovellus vain yhdistää niihin.

> Kehitys-ympäristö ja tuotantoympäristö käyttävät eri Azure Cosmos DB tiliä. Tämän vuoksi molemmille on asetettava omat URI ja SECRET_KEY arvot **.env** tiedostoon. Sovellus valitsee käynnistyessään tilin mihin se luo tietokantayhteyden riippuen siitä käynnistettiinkö se kehitys vai tuotanto moodissa.

### Tietokantayhteyksien testaaminen

Tietokannan toimintaa voi testata ajamalla kutsuja **src/requests** kansiosta löytyvistä **.rest** tiedostoista, esimerkiksi [login.rest](src/requests/login.rest). Nämä käyttävät oletuksena porttia 8080 kutsuissa, porttinumero tulee vaihtaa kutsuihin jos sen on vaihtanut **.env** tiedostossa.

### Tietokantayhteyksien arkkitehtuuri

[app.ts](src/app.ts) tiedostoon kirjataan ylemmän tason api endpointit kuten **/api/receipts** ja sille liitetään oma router kuten **receiptRouter**

[daoHelper.ts](src/utils/daoHelper.ts) sisältää tietokannan ja containereiden luontiin tarkoitetut funktiot. [app.ts](src/app.ts) suorittaa nämä toiminnot init funktion kautta.

Jokaiselle routerille on oma tiedostonsa **src/controllers** kansiossa, esimerkiksi [receipts.ts](src/controllers/receipts.ts). Tänne talletetaan alemman tason API endpointit sekä CRUD menetelmät joilla niitä kutsutaan.

Routerit tarvitsevat tietokantayhteyksien luomiseen ja hallinnointiin apumetodeja joita säilytetään src/models kansiossa, esimerkiksi [receiptDao.ts](src/models/receiptDao.ts). Jokaiselle tietokanta-routerille on oma model aputiedosto.

[config.ts](src/utils/config.ts) sisältää tietokantojen ja containereiden käyttämät nimet. Sovelluksen käynnistyessä se myös määrittelee mitä tietokantayhteyttä käytetään. Tuotanto ja kehitys ympäristöissä käytetään eri Cosmos DB tilejä.

> Saman Cosmos DB tilin sisälle voi myös lisätä useita eri tietokantoja. Oletuksena sovellus käyttää vain yhtä mutta uuden voi asettaa parametriksi haluttuun containeriin.

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
│   │   ├── receipts.ts
│   │   └── ...
│   ├── models
│   │   ├── receipt.ts
│   │   ├── receiptDao.ts
│   │   └── ...
│   ├── utils
│   │   ├── config.ts
│   │   ├── daoHelper.ts
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
  - **yarn run build** -komento luo tuotanto palvelin koonnin
  - **yarn run start** -komento käynnistää tuotantopalvelimen

- docs - Kansioon voi tallentaa erinäistä dokumentaatio tukemaan kehitystä

- src - Kansio sisältää kaiken backendin toiminnallisuuden

- controllers - Kansio sisältää eri api osoitteiden routerit

- [receipts.ts](src/controllers/receipts.ts) - Router joka yhdistää URL API endpointit model luokassa määriteltyihin CRUD tietokanta operaatioihin

- models - Kansio sisältää routereiden apumetodit jotka käyttävät tietokanta yhteyksiä

- [receipt.ts](src/models/receipt.ts) - Model josta löytyy kuittien sisällön määrittely typescriptin type oliona

- [receiptDao.ts](src/models/receiptDao.ts) - Model josta löytyy [receipts.ts](src/controllers/receipts.ts) tiedostossa käytetyt tietokanta CRUD operaatiot

- utils - Kansio joka sisältää ohjelman aputiedostot

- requests - Kansio sisältää REST tyylisiä kutsuja joilla voi testata tietokannan toimivuutta

- [config.ts](src/utils/config.ts) - Määrittelee ulospäin menevät yhteydet **.env** tiedoston avulla

- [daoHelper.ts](src/utils/daoHelper.ts) - Sisältää tietokantayhteyden luontiin tarvittavat metodit. Luo uudet tietokannat ja containerit ellei niitä jo ole olemassa.

- [logger.ts](src/utils/logger.ts) - Luo info ja error logit joita voi käyttää console.log sijaan

- [middleware.ts](src/utils/middleware.ts) - Sisältää apuominaisuuksia jotka reagoivat apikutsuihin ja niiden onnistumiseen

- [app.ts](src/app.ts) - Yhdistää sovelluksen eri toiminnallisuudet
  - Luo yhteyden tietokantaan
  - ottaa käyttöön middlewaret
  - luo api polut ja liittää niihin tarvittavan routerin

- [index.ts](src/index.ts) - Luo ja käynnistää sovelluspalvelimen

- **.env** - Tämä tiedosto tulee jokaisen kehittäjän itse luoda, sisältää mahdollisesti salaista tietoa. Alla on tarkemmat ohjeet **.env**-tiedoston vaaditulle sisällölle

#### Sisältö .env tiedostolle

```

PORT="1"

DEV_DB_URI="2"

DEV_DB_SECRET_KEY="3"

PROD_DB_URI="4"

PROD_DB_SECRET_KEY="5"

SECRET="6"

```

1. valittu portti johon sovelluspalvelin käynnistyy, esim 8000
2. verkko-osoite kehitys-version Azure Cosmos DB tilille
3. salainen avain jota tarvitaan kehitys-version tietokanta yhteyden avaamiseen
4. verkko-osoite tuotanto-version Azure Cosmos DB tilille
5. salainen avain jota tarvitaan tuotanto-version tietokanta yhteyden avaamiseen
5. salainen merkkijono jolla luodaan kirjautumistoken käyttäjälle