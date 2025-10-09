import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.reply.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.roomAmenity.deleteMany()
  await prisma.room.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.roomType.deleteMany()
  await prisma.operator.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10)
  const operatorPassword = await bcrypt.hash('operator123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@hotelelefante.com',
      passwordHash: adminPassword,
      name: 'Administrador Principal',
      role: 'ADMIN' as any,
    },
  })

  const operator1 = await prisma.user.create({
    data: {
      email: 'operador1@hotelelefante.com',
      passwordHash: operatorPassword,
      name: 'María González',
      role: 'OPERATOR',
      operatorInfo: {
        create: {
          phone: '+54 387 4567890',
          active: true,
        },
      },
    },
  })

  const operator2 = await prisma.user.create({
    data: {
      email: 'operador2@hotelelefante.com',
      passwordHash: operatorPassword,
      name: 'Juan Pérez',
      role: 'OPERATOR',
      operatorInfo: {
        create: {
          phone: '+54 387 4567891',
          active: true,
        },
      },
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: 'cliente1@example.com',
      passwordHash: userPassword,
      name: 'Ana Martínez',
      role: 'USER',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'cliente2@example.com',
      passwordHash: userPassword,
      name: 'Carlos Rodríguez',
      role: 'USER',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'cliente3@example.com',
      passwordHash: userPassword,
      name: 'Lucía Fernández',
      role: 'USER',
    },
  })

  console.log('✅ Usuarios creados')

  // Crear tipos de habitación
  const standard = await prisma.roomType.create({
    data: {
      name: 'Standard',
      description:
        'Habitación acogedora con todas las comodidades básicas. Ideal para viajeros individuales o parejas.',
      basePrice: 12000,
      maxGuests: 2,
    },
  })

  const superior = await prisma.roomType.create({
    data: {
      name: 'Superior',
      description:
        'Habitación amplia con vista panorámica al Cerro Elefante. Incluye zona de estar.',
      basePrice: 18000,
      maxGuests: 3,
    },
  })

  const suite = await prisma.roomType.create({
    data: {
      name: 'Suite Deluxe',
      description:
        'Suite de lujo con dormitorio separado, sala de estar y baño premium con jacuzzi.',
      basePrice: 28000,
      maxGuests: 4,
    },
  })

  const familySuite = await prisma.roomType.create({
    data: {
      name: 'Suite Familiar',
      description:
        'Amplia suite con dos dormitorios, perfecta para familias. Capacidad hasta 6 huéspedes.',
      basePrice: 35000,
      maxGuests: 6,
    },
  })

  const vipSuite = await prisma.roomType.create({
    data: {
      name: 'Suite VIP',
      description:
        'Nuestra mejor suite con terraza privada, jacuzzi exterior y servicio personalizado 24/7.',
      basePrice: 45000,
      maxGuests: 4,
    },
  })

  console.log('✅ Tipos de habitación creados')

  // Crear amenidades
  const amenities = await prisma.amenity.createMany({
    data: [
      { name: 'WiFi Gratis', icon: 'Wifi' },
      { name: 'Aire Acondicionado', icon: 'Wind' },
      { name: 'TV Cable', icon: 'Tv' },
      { name: 'Minibar', icon: 'Wine' },
      { name: 'Caja Fuerte', icon: 'Lock' },
      { name: 'Desayuno Incluido', icon: 'Coffee' },
      { name: 'Vista al Cerro', icon: 'Mountain' },
      { name: 'Balcón Privado', icon: 'Home' },
      { name: 'Jacuzzi', icon: 'Droplet' },
      { name: 'Servicio a la Habitación', icon: 'UtensilsCrossed' },
    ],
  })

  const allAmenities = await prisma.amenity.findMany()

  console.log('✅ Amenidades creadas')

  // Crear habitaciones con imágenes locales
  const rooms = [
    {
      number: '101',
      floor: 1,
      roomTypeId: standard.id,
      images: JSON.stringify(['/Imagenes del hotel/suite estandar.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6],
    },
    {
      number: '102',
      floor: 1,
      roomTypeId: standard.id,
      images: JSON.stringify(['/Imagenes del hotel/suite estandar.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6],
    },
    {
      number: '103',
      floor: 1,
      roomTypeId: standard.id,
      images: JSON.stringify(['/Imagenes del hotel/suite estandar.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6],
    },
    {
      number: '201',
      floor: 2,
      roomTypeId: superior.id,
      images: JSON.stringify(['/Imagenes del hotel/suite vip.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      number: '202',
      floor: 2,
      roomTypeId: superior.id,
      images: JSON.stringify(['/Imagenes del hotel/suite vip.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      number: '203',
      floor: 2,
      roomTypeId: superior.id,
      images: JSON.stringify(['/Imagenes del hotel/suite vip.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      number: '301',
      floor: 3,
      roomTypeId: suite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite deluxe.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      number: '302',
      floor: 3,
      roomTypeId: suite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite deluxe.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      number: '401',
      floor: 4,
      roomTypeId: familySuite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite familiar.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 10],
    },
    {
      number: '402',
      floor: 4,
      roomTypeId: familySuite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite familiar.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 10],
    },
    {
      number: '501',
      floor: 5,
      roomTypeId: vipSuite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite presi.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      number: '502',
      floor: 5,
      roomTypeId: vipSuite.id,
      images: JSON.stringify(['/Imagenes del hotel/suite presi.jpg']),
      amenityIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ]

  for (const roomData of rooms) {
    const { amenityIds, ...data } = roomData
    const room = await prisma.room.create({
      data: {
        ...data,
        status: 'AVAILABLE',
      },
    })

    // Asociar amenidades
    for (const amenityId of amenityIds) {
      await prisma.roomAmenity.create({
        data: {
          roomId: room.id,
          amenityId: amenityId,
        },
      })
    }
  }

  console.log('✅ Habitaciones creadas')

  // Crear reservas de ejemplo
  const room101 = await prisma.room.findUnique({ where: { number: '101' } })
  const room201 = await prisma.room.findUnique({ where: { number: '201' } })
  const room301 = await prisma.room.findUnique({ where: { number: '301' } })

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  // Reserva confirmada
  await prisma.reservation.create({
    data: {
      roomId: room101!.id,
      userId: user1.id,
      checkIn: tomorrow,
      checkOut: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
      guests: 2,
      status: 'CONFIRMED',
      totalAmount: 36000,
      paidAmount: 36000,
      payment: {
        create: {
          provider: 'MERCADO_PAGO',
          status: 'approved',
          amount: 36000,
          externalId: 'mp_test_12345',
        },
      },
    },
  })

  // Reserva pendiente de pago
  await prisma.reservation.create({
    data: {
      roomId: room201!.id,
      userId: user2.id,
      checkIn: nextWeek,
      checkOut: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
      guests: 3,
      status: 'PENDING_PAYMENT',
      totalAmount: 36000,
      paidAmount: 0,
    },
  })

  // Reserva futura confirmada
  await prisma.reservation.create({
    data: {
      roomId: room301!.id,
      userId: user3.id,
      checkIn: nextMonth,
      checkOut: new Date(nextMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
      guests: 2,
      status: 'CONFIRMED',
      totalAmount: 140000,
      paidAmount: 140000,
      payment: {
        create: {
          provider: 'MERCADO_PAGO',
          status: 'approved',
          amount: 140000,
          externalId: 'mp_test_67890',
        },
      },
    },
  })

  console.log('✅ Reservas creadas')

  // Crear mantenimiento de ejemplo (habitación 103 en mantenimiento)
  const room103 = await prisma.room.findUnique({ where: { number: '103' } })
  await prisma.maintenance.create({
    data: {
      roomId: room103!.id,
      reason: 'Reparación de aire acondicionado',
      from: today,
      to: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      active: true,
    },
  })

  await prisma.room.update({
    where: { id: room103!.id },
    data: { status: 'CLOSED' },
  })

  console.log('✅ Mantenimiento creado')

  // Crear mensajes de contacto
  await prisma.contactMessage.create({
    data: {
      name: 'Pedro Gómez',
      email: 'pedro@example.com',
      phone: '+54 387 1234567',
      subject: 'Consulta sobre eventos',
      message: '¿El hotel cuenta con salón para eventos corporativos? Necesito para 50 personas.',
      status: 'RECEIVED',
    },
  })

  await prisma.contactMessage.create({
    data: {
      name: 'Laura Sánchez',
      email: 'laura@example.com',
      phone: '+54 387 7654321',
      subject: 'Disponibilidad para grupos',
      message:
        'Buenos días, queremos reservar varias habitaciones para un grupo de 20 personas en julio. ¿Tienen disponibilidad?',
      status: 'RECEIVED',
    },
  })

  console.log('✅ Mensajes de contacto creados')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📋 Usuarios de prueba:')
  console.log('  Admin: admin@hotelelefante.com / admin123')
  console.log('  Operador 1: operador1@hotelelefante.com / operator123')
  console.log('  Operador 2: operador2@hotelelefante.com / operator123')
  console.log('  Cliente 1: cliente1@example.com / user123')
  console.log('  Cliente 2: cliente2@example.com / user123')
  console.log('  Cliente 3: cliente3@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
