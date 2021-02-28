import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

    async execute(request: Request, response: Response){
        const { email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);
        
        const user = await usersRepository.findOne({
            email,
        });

        if(!user){
            return response.status(400).json({
                error: "User does not exists",
            });
        }

        const survey = await surveyRepository.findOne({
            id: survey_id,
        })

        if(!survey){
            return response.status(400).json({
                error: "Survey does not exists",
            });
        }
        const npsPath = resolve(__dirname, "..","views","emails", "npsMail.hbs");

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL,
        }

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: [
                {user_id: user.id},
                {value: null}
            ],

            relations: ["user", "survey"]
        });

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        // Salvar as informacoes
        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveyUserRepository.save(surveyUser);

        //Enviar o email

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser)

    }
}

export { SendMailController }