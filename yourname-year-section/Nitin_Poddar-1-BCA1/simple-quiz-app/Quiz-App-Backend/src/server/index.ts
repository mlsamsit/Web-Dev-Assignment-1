import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { connectDB, Questions, Quizzes, Users, Stats} from '../database/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import {z} from 'zod';
import bcrypt from 'bcrypt';

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 30; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const quizVerifier = z.object({
  quizName: z.string().nonempty(),
  questions: z.array(
    z.object({
      question: z.string().nonempty(),
      options: z.array(z.string().nonempty()).min(1),
      answer: z.number().int().nonnegative()
    })
  ).min(1)
});

function checkCreds(req: Request, res: Response, next: NextFunction) {
    const {userName, password} = req.body

    const zodUserSchema = z.string().regex(/^[A-Za-z0-9_]+$/).min(4).max(20)

    const zodPassSchema = z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,20}$/)
    

    const userCheck = zodUserSchema.safeParse(userName)
    const passCheck = zodPassSchema.safeParse(password)

    if (!userCheck.success) {
        res.status(400).json({
            message: "Username must be between 4-20 characters and can only have letters, numbers and underscore."
        })
        return;
    }

    if (!passCheck.success) {
        res.status(400).json({
            message: "Password must be between 8-20 characters and must include at least one letter, one number, and one special character"
        })
        return;
    }

    next()
}

app.post('/signup', checkCreds, async (req, res) => {
    const { userName, password } = req.body
    const user_name = userName.toLowerCase()

    try{
        const user = await Users.findOne({userName: user_name})

        if (user) {
            return res.status(400).json({
                message: 'This username is already taken!'
            })
        }

        const token = generateRandomString()
        const hash = await bcrypt.hash(password, 7)

        await Users.create({
            userName: user_name,
            password: hash,
            token
        })

        return res.status(200).json({
          message: 'sign up successful! Please Sign in.'
        })
    } catch(e: unknown) {
        const err = e as Error
        return res.status(500).json({
            message: 'some error interrupted the action!',
            error: err.message
        })
    }
})

app.post('/signin', async(req, res) => {
    const { type } = req.body
    if (type != 'password' && type != 'token') {
        return res.status(400).json({
            message: 'invalid auth type (should be either password or token)',
        })
    }

    try {
        if (type == 'password') {
        const { userName, password } = req.body
        const user_name = userName.toLowerCase()
        const user = await Users.findOne({userName: user_name})
        if (!user) {
            return res.status(400).json({
                message: 'invalid username!'
            })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(400).json({
                message: 'invalid password!'
            })
        }

        if (!user.token) {
            const token = generateRandomString()
            await Users.updateOne(
                {userName: user_name},
                {$set: {token}}
            )
            return res.status(200).json({
                message: 'sign in successful!',
                token,
                userName: user.userName
            })    
        }
        return res.status(200).json({
            message: 'sign in successful!',
            userName: user.userName,
            token: user.token
        })
    }

    const { token } = req.body
    const user = await Users.findOne({token})

    if (!user) {
        return res.status(400).json({
            message: 'sign in failed!',
            reason: 'invalid token'
        })
    }

    return res.status(200).json({
        message: 'sign in successful!',
        userName: user.userName
    })
    } catch (e) {
        return res.status(500).json({
            message: 'some error interrupted the action',
            error: (e as Error).message
        })
    }
})

app.post('/logout', async(req, res) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({
            message: 'No token provided!'
        })
    }

    try {
        const user = await Users.findOne({token})
        if (!user) {
            return res.status(404).json({
                message: 'No such user exists! Please verify your token'
            })
        }
        user.token = ''
        await user.save()
        return res.status(200).json({
            message: 'logged out successfully!'
        })

    } catch(e) {
        return res.status(500).json({
            message: 'Some error interrupted the action',
            error: (e as Error).message
        })
    }
})

app.get('/quizzes', async(req, res) => {
    try {
        const quizzes = await Quizzes.find({})

        return res.status(200).json({
            quizzes
        })
    } catch(e) {
        return res.status(500).json({
            message: 'There was a problem while getting the list of available quizzes!'
        })
    }   
})

app.get('/stats', async (req, res) => {
    const token = req.headers['token']
    try {
        const user = await Users.findOne({token})
        if (!user) {
            return res.status(400).json({
                message: 'Invalid token!\nPlease SignIn again.'
            })
        }

        const stats = await Stats.findOne({userName: user.userName});
        if (!stats) {
            return res.status(404).json({
                message: 'No stats found for this user!'
            })
        }

        return res.status(200).json(stats)
    } catch (e) {
        return res.status(500).json({
            message: 'some error interrupted the action',
            error: (e as Error).message
        })
    }
})

app.post('/stats', async (req, res) => {
    try {
        const { token, title, score, time } = req.body;

        if (!token || !title || !score || !time) {
            return res.status(400).json({ message: 'missing required fields' });
        }

        const user = await Users.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: 'invalid token provided' });
        }

        let userStats = await Stats.findOne({ userName: user.userName });

        if (!userStats) {
            await Stats.create({
                userName: user.userName,
                stats: [{ title, score, time }]
            });
        } else {
            userStats.stats.push({ title, score, time });
            await userStats.save();
        }

        return res.status(200).json({ message: 'stats recorded successfully!' });
    } catch (e) {
        return res.status(500).json({
            message: 'some error interrupted the action',
            error: (e as Error).message
        });
    }
});

app.get('/quiz/:title', async(req, res) => {
    const title = req.params.title

    try {
        const quiz = await Questions.findOne({quizName: title})

        if (quiz) {
            return res.status(200).send(quiz)
        } else {
            return res.status(400).json({
                message: 'No such quiz exists!'
            })
        }
    } catch(e) {
        return res.status(500).json({
            message: 'Server problem occured!'
        })
    }
})

app.post('/quizzes', async(req, res) => {
    const quizName = req.body.quizName
    const questions = req.body.questions
    const token = req.body.token
    const result = quizVerifier.safeParse({
        quizName,
        questions
    })

    if (!result.success) {
        return res.json({
            message: 'Incorrect Input!'
        })
    }

    try {
        const user = await Users.findOne({token})
        if (!user) {
            return res.status(400).json({
                message: 'Invalid Token, please sign in again.'
            })
        }
        const quiz = await Questions.findOne({quizName})

        if (quiz) {
            return res.status(400).json({
                message: 'The name should be unique!'
            })
        }
        await Questions.create({
            quizName,
            questions
        })

        await Quizzes.create({
            title: quizName,
            addedBy: user.userName
        })

        return res.status(200).json({
            message: 'Quiz created successfully!'
        })
    } catch(e) {
        console.log((e as Error).message)
        return res.status(500).json({
            message: 'Server problem occured!'
        })
    }
})

app.delete('/quizzes', async (req, res) => {
  const { quizName, token } = req.body;

  if (!quizName || !token) {
    return res.status(400).json({ message: 'Quiz name and token are required!' });
  }

  try {
    const user = await Users.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token!' });
    }

    const quiz = await Quizzes.findOne({ title: quizName });
    if (!quiz) {
      return res.status(404).json({ message: 'No such quiz exists!' });
    }

    if (quiz.addedBy !== user.userName) {
      return res.status(403).json({ message: 'You can only delete the quizzes added by you!' });
    }

    await Questions.deleteOne({ quizName });
    await Quizzes.deleteOne({ title: quizName });

    return res.status(200).json({ message: 'Quiz deleted successfully!' });
  } catch (e) {
    return res.status(500).json({
      message: 'Some error interrupted the action!',
      error: (e as Error).message
    });
  }
});


// app.all('*', (req, res) => {
//     res.status(404).send('Invalid route!')
// })
app.use((req, res) => {
  res.status(404).send('404 - Invalid Route!');
});


const port = process.env.PORT || 8080

app.listen(port, (err) => {
    if (err) {
        console.log('Failed to start server!')
        console.log(err.message)
        return
    }
    console.log(`App is listening on http://localhost:${port}`)
    connectDB().then(() => {
        console.log('Database connected successfully!')
    }).catch((err) => {
        console.log('Failed to connect with database!')
        console.log(err.message)
    })
})