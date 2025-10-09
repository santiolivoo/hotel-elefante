const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...')
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

  try {
    await prisma.$connect()
    console.log('✅ Conexión exitosa!')
    
    // Intentar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Consulta exitosa:', result)
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    console.error('Detalles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
