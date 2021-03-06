const puppeteer = require('puppeteer')

const cities = require('./cities.json')

const fs = require('fs')

const data = {}

const cleanData = function (schools) {
  const data = []
  for (const sch of schools) {
    const words = sch.split('-')
    if (words.length < 2) {
      continue
    }
    const schoolName = words[words.length - 1].trim()
    data.push(schoolName)
  }
  return data
}

const extractData = function () {
  const list = [
    'ADANA',
    'ADIYAMAN',
    'AFYONKARAHİSAR',
    'AĞRI',
    'AMASYA',
    'ANKARA',
    'ANTALYA',
    'ARTVİN',
    'AYDIN',
    'BALIKESİR',
    'BİLECİK',
    'BİNGÖL',
    'BİTLİS',
    'BOLU',
    'BURDUR',
    'BURSA',
    'ÇANAKKALE',
    'ÇANKIRI',
    'ÇORUM',
    'DENİZLİ',
    'DİYARBAKIR',
    'EDİRNE',
    'ELÂZIĞ',
    'ERZİNCAN',
    'ERZURUM',
    'ESKİŞEHİR',
    'GAZİANTEP',
    'GİRESUN',
    'GÜMÜŞHANE',
    'HAKKARİ',
    'HATAY',
    'ISPARTA',
    'MERSİN',
    'İSTANBUL',
    'İZMİR',
    'KARS',
    'KASTAMONU',
    'KAYSERİ',
    'KIRKLARELİ',
    'KIRŞEHİR',
    'KOCAELİ',
    'KONYA',
    'KÜTAHYA',
    'MALATYA',
    'MANİSA',
    'KAHRAMANMARAŞ',
    'MARDİN',
    'MUĞLA',
    'MUŞ',
    'NEVŞEHİR',
    'NİĞDE',
    'ORDU',
    'RİZE',
    'SAKARYA',
    'SAMSUN',
    'SİİRT',
    'SİNOP',
    'SİVAS',
    'TEKİRDAĞ',
    'TOKAT',
    'TRABZON',
    'TUNCELİ',
    'ŞANLIURFA',
    'UŞAK',
    'VAN',
    'YOZGAT',
    'ZONGULDAK',
    'AKSARAY',
    'BAYBURT',
    'KARAMAN',
    'KIRIKKALE',
    'BATMAN',
    'ŞIRNAK',
    'BARTIN',
    'ARDAHAN',
    'IĞDIR',
    'YALOVA',
    'KARABÜK',
    'KİLİS',
    'OSMANİYE',
    'DÜZCE',
  ]
  return Object.values(document.getElementsByTagName('a'))
    .filter((i) => {
      for (const name of list) {
        if (i.text.includes(name)) {
          return true
        }
      }
      return false
    })
    .map((i) => i.text)
}

const fetchSchools = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (const city of cities) {
    await page.goto(
      `https://www.meb.gov.tr/baglantilar/okullar/index.php?ILKODU=${city.no}`
    )
    const items = await page.evaluate(extractData)

    const schools = cleanData(items)

    const key = `${city.name}`.toLocaleLowerCase('tr-TR')

    data[key] = schools

    console.log(city.name)
  }

  fs.writeFileSync('./schools.json', JSON.stringify(data))
}

fetchSchools()
