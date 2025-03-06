const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vpcilzpabhrokjfrjeap.supabase.co';
const supabaseKey = 'eyJhbGciOi...'; // Dein Anon Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test1234'
  });
  console.log('DATA:', data);
  console.log('ERROR:', error);
}

testSignup();
