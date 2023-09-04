const {
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
  mkdirSync,
  rmdirSync,
} = require('fs')

const { SITE_NAME } = process.env

const languages = [
  { language: 'fr', url: '/numerique-responsable' },
  { language: 'en', url: '/en/responsible-digital' },
]

function getGrade(ecoIndex) {
  if (ecoIndex > 80) {
    return 'A'
  }
  if (ecoIndex > 70) {
    return 'B'
  }
  if (ecoIndex > 55) {
    return 'C'
  }
  if (ecoIndex > 40) {
    return 'D'
  }
  if (ecoIndex > 25) {
    return 'E'
  }
  if (ecoIndex > 10) {
    return 'F'
  }
  return 'G'
}

const output = {
  name: SITE_NAME,
  layout: 'responsible-digital',
  translationKey: 'index',
  description: '',
  clef: 'index',
  titre: 'site title',
  score: 0,
  ges: 0,
  water: 0,
  grade: 'A',
  date: new Date(),
  pages: [],
  visit: [],
}

if (!existsSync('responsible-digital.json')) {
  console.error('No responsible-digital.json file')
  return process.exit(1)
}

const file = JSON.parse(readFileSync('responsible-digital.json', 'utf-8'))

for (const page of file) {
  if (page.url.includes('responsible-digital') || page.url.includes('#')) {
    continue
  }

  output.score += page.score
  output.ges += page.ges
  output.water += page.water
  const path = page.url.match(/(?<!\/\/)(?<=\/)[\w-]+(?=\/)/g)
  output.pages.push({
    ...page,
    url: `/${path?.join('/') || ''}`,
    name: `${path?.pop() || 'accueil'}${
      path?.length ? ` depuis /${path?.join('/')}` : ''
    }`,
  })
}

output.pages.sort(
  ({ name: firstName }, { name: secondName }) =>
    firstName.split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 0) -
    secondName.split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 0)
)

output.visit = [
  {
    name: 'Parcours complet',
    objective: "Représenter une navigation d'un utilisateur",
    target: 'Naviguer a travers la totalité du site',
    ...output.pages.reduce(
      (out, page) => ({
        water: out.water + page.water,
        ges: out.ges + page.ges,
        pages: [...out.pages, page.name],
      }),
      { pages: [], water: 0, ges: 0 }
    ),
  },
]

output.score = output.score / output.pages.length
output.grade = getGrade(output.score)

for (const { language, url } of languages) {
  writeFileSync(
    `../../out/declarations/responsible-digital-${language}.md`,
    JSON.stringify({ ...output, url })
  )
}

if (existsSync('data')) {
  rmSync('data', { recursive: true })
}

mkdirSync('data')
writeFileSync(
  'data/ecoStats.json',
  JSON.stringify({
    ...output.pages.reduce(
      (acc, { url, ges, water, score }) => ({
        ...acc,
        [url.length>1?`${url}/` : url]: { ges, water, score },
      }),
      {}
    ),
  })
)

rmSync('responsible-digital.json')
