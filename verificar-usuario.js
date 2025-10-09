const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verificarUsuarios() {
  console.log('👥 Verificando usuarios y sus emails...')
  console.log('=====================================')

  try {
    // Obtener todos los usuarios
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n📋 Total de usuarios: ${usuarios.length}`)
    console.log('\n👤 Lista de usuarios:')
    usuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   👔 Rol: ${user.role}`)
      console.log(`   📅 Registrado: ${user.createdAt.toLocaleDateString('es-AR')}`)
      console.log('')
    })

    // Obtener reservas recientes
    const reservas = await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        room: {
          select: {
            number: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    console.log('🏨 Últimas 5 reservas:')
    reservas.forEach((reserva, index) => {
      console.log(`${index + 1}. Habitación ${reserva.room.number}`)
      console.log(`   👤 Cliente: ${reserva.user.name}`)
      console.log(`   📧 Email del cliente: ${reserva.user.email}`)
      console.log(`   📅 Check-in: ${reserva.checkIn.toLocaleDateString('es-AR')}`)
      console.log(`   💰 Total: $${reserva.totalAmount}`)
      console.log(`   📊 Estado: ${reserva.status}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verificarUsuarios()
