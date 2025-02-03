import bcrypt from 'bcryptjs';

const password = '4rfvVGZ/1984';

async function generateHash() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hashed password:', hashedPassword);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Hash verification:', isValid);
}

// Run the function
generateHash().catch(console.error);