import mongoose from "mongoose";
export declare const Users: mongoose.Model<{
    userName: string;
    password: string;
    token: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    userName: string;
    password: string;
    token: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    userName: string;
    password: string;
    token: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    userName: string;
    password: string;
    token: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userName: string;
    password: string;
    token: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    userName: string;
    password: string;
    token: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Questions: mongoose.Model<{
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
}, {}, mongoose.DefaultSchemaOptions> & {
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    quizName: string;
    questions: mongoose.Types.DocumentArray<{
        question: string;
        options: string[];
        answer: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        question: string;
        options: string[];
        answer: number;
    }> & {
        question: string;
        options: string[];
        answer: number;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Quizzes: mongoose.Model<{
    title: string;
    addedBy: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    addedBy: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    title: string;
    addedBy: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    title: string;
    addedBy: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    addedBy: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    title: string;
    addedBy: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Stats: mongoose.Model<{
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
}, {}, mongoose.DefaultSchemaOptions> & {
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    userName: string;
    stats: mongoose.Types.DocumentArray<{
        title: string;
        score: string;
        time: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        score: string;
        time: string;
    }> & {
        title: string;
        score: string;
        time: string;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare function connectDB(): Promise<typeof mongoose>;
//# sourceMappingURL=db.d.ts.map