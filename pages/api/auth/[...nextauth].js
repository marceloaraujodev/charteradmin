import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

// change to a function a request to db. create a model for admins, 
const adminEmails = ['ppzmarcelo@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session, token, user}) => {
      // console.log(session, user)
      if(adminEmails.includes(session?.user?.email)){
        // console.log('admin user')
        return session;
      }
      return session;
    },
  }
}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res){
  const session = await getServerSession(req, res, authOptions);
  // console.log('Admin session:', session);

  if(!adminEmails.includes(session?.user?.email)){
    // if try to go to routes without being admin /categories or /products get error
    res.status(401).json('Not a Admin').end()
    // console.log('signing out')
  }
} 