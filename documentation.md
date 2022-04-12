# Dokumentaatio - eKuittilompakko backend

## Ohjelman toiminnot konsolista
  - yarn install - asenna riippuvuudet
  - yarn run dev - käynnistä kehitysympäristö
  - yarn run build - luo tuotantoversio koonti
  - yarn run start - käynnistä tuotantoversio
  - yarn run test - käynnistä testiympäristö (ei vielä toiminnassa)

> Luo oma .env tiedosto projektin juureen ennen ennen kuin ajat ohjelmaa

> Yhteyttä voi testata selaimesta http://localhost:<porttinumero>/api/hello
> Myös http://localhost:<porttinumero>/api/hello/<nimesitähän> toimii

> HUOM! Tietokantayhteys ei ole vielä toiminnassa


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
│   │   └── ...
│   ├── utils
│   │   ├── config.ts
│   │   ├── logger.ts
│   │   ├── middleware.ts
│   │   └── ...
│   ├── app.ts
│   ├── index.ts
├── .env (hidden)
├── ...

Lisätään models kansio kun tietokantayhteydet ovat toiminnassa
Muita lisättäviä kansioita requests ja tests mahdollisia testejä varten
```

#### Struktuurin selitykset
dist - Kansioon valmistuu backending koonti.
  - yarn run build -komento luo tuotanto palvelin koonnin
  - yarn run start -komento käynnistää tuotantopalvelimen
docs - Kansioon voi tallentaa erinäistä dokumentaatio tukemaan kehitystä
src - Kansio sisältää kaiken backendin toiminnallisuuden
controllers - Kansio sisältää eri api osoitteiden routerit
hello.ts - Esimerkki router joka määrittelee CRUD operaatiot kyseiselle api-osoitteelle
utils - Kansio joka sisältää ohjelman aputiedostot
config.ts - Määrittelee ulospäin menevät yhteydet .env tiedoston avulla
logger.ts - Luo info ja error logit joita voi käyttää console.log sijaan
middleware.ts - Sisältää apuominaisuuksia jotka reagoivat apikutsuihin ja niiden onnistumiseen
app.ts - Yhdistää sovelluksen eri toiminnallisuudet
  - Luo yhteyden tietokantaan
  - ottaa käyttöön middlewaret
  - luo api polut ja liittää niihin tarvittavan routerin
index.ts - Luo ja käynnistää palvelimen
.env - Tämä tiedosto tulee jokaisen kehittäjän itse luoda, sisältää mahdollisesti salaista tietoa
  - Alla on tarkemmat ohjeet .env-tiedoston vaaditulle sisällölle

#### .env vaadittu sisältö

```

PORT="<valittu portti, esim 8000>"
DB_URI="<verkko-osoite tietokantaan jota käytetään tuotannossa/kehityksessä>"
DB_SECRET_KEY="<salainen avain jota tarvitaan tietokanta yhteyden avaamiseen>"
TEST_DB_URI="<verkko-osoite tietokantaan jota käytetään testeissä/kehityksessä>"

```

