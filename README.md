# Secrets App

A secure application that allowed users to share their secrets anonymously with others. Secrets can be created, read, updated, and deleted.

## 1. Technologies used

1. **NodeJS** runtime environment
   - **EJS** view engine
   - **Express Session** middleware
   - **Connect-ensure-login** middleware
2. Style & Layout
   - **SCSS** styling syntax
   - **Bootstrap** CSS framework
   - **Fontawesome** Icons
3. **MongoDB** database
   - **Mongoose** library
   - **Mongoose findOrCreate** plugin
   - **Passport-local-mongoose** for generating salt/hash fields in db
4. **Passport** authentication middleware
   - **Passport-local** strategy
   - **Google OAuth 2.0** strategy

---

## 2. Database

Using MongoDB with 2 collections:

```
users {_id, username, salt, hash, secrets}
secrets [ {_id, secret} ]
```

How a stored User looks like:

```
{
   _id: ObjectId('64021ee2f65e6556557ad5u5'),
   username: "Emma",
   salt: "1d9cdec6fe3016817341533a30ef33509d27be87623cecb8s...",
   hash: "051ee50e1e8de673a6d9a082e9e462855af8b199dcajd9edu...",
   secrets: [
      {
         _id: ObjectId('64021ee9f65e6556557ad5ue'),
         secret: "When my roommates aren't home, I don't w...",
      },
       {
         _id: ObjectId('64021ef9f65e6556557ads0b'),
         secret: "Everyday my brother knocks on my door and...",
      }
   ]
}
```

---

## 3. Screenshots

> <code>/login</code> <code>/register</code> Sign Up or Sign In with an account or google auth.
> ![alt login and signup page](img/secrets3.jpg?raw=true)

> <code>/secrets</code> The home page with anonymously shared secrets.
> ![alt secrets page](img/secrets1.jpg?raw=true)

> <code>/submit</code> The submit page where users can share their own secrets.
> ![alt submit a secret page](img/secrets2.jpg?raw=true)

> <code>/mysecrets</code> The secrets page where users can modify their published secrets .
> ![alt edit my secrets page](img/secrets6.jpg?raw=true)

> <code>/error</code> Error page for unkown endpoints.
> ![alt error page](img/secrets5.jpg?raw=true)

---
