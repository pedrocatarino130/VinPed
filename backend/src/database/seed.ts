import pool from '../config/database.js'

const defaultCategories = [
  { name: 'Alimentação', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
  { name: 'Saúde', icon: '⚕️', color: '#95E1D3' },
  { name: 'Educação', icon: '📚', color: '#F7DC6F' },
  { name: 'Lazer', icon: '🎮', color: '#BB8FCE' },
  { name: 'Moradia', icon: '🏠', color: '#85C1E2' },
  { name: 'Vestuário', icon: '👔', color: '#F8B88B' },
  { name: 'Salário', icon: '💰', color: '#00FF88' },
  { name: 'Investimentos', icon: '📈', color: '#52B788' },
  { name: 'Outros', icon: '📦', color: '#9D9D9D' },
]

async function seed() {
  const client = await pool.connect()

  try {
    console.log('🌱 Seeding database...')

    // Insert default categories
    for (const category of defaultCategories) {
      await client.query(
        `INSERT INTO categories (name, icon, color, is_default, user_id)
         VALUES ($1, $2, $3, TRUE, NULL)
         ON CONFLICT DO NOTHING`,
        [category.name, category.icon, category.color]
      )
    }

    console.log('✅ Database seeded successfully!')
    console.log(`   - Inserted ${defaultCategories.length} default categories`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
