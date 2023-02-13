import server from './server'

async function main() {
  const app = new server()
  await app.listen()
}

main()
