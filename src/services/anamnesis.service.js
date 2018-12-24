const listQueryBuilder = require('../helpers/querybuilders/list.querybuilder');
const db = require("../models/index.js");

// CRIAR ANAMNESE => PREENCHE CAMPOS => CLICK SUBMIT FORM BTN => ADICIONA NA TELA OPÇÃO DE ADICIONAR PERGUNTAS NA ANAMNESE

const AnamnesisService = {

    getAllAnamnesis(queryParams) {
        let queryBuilder = listQueryBuilder(queryParams);

        queryBuilder.include = [{ model: db.AnamnesisQuestion, as: 'questions'}];

        return db.Anamnesis.findAndCountAll(queryBuilder);
    },

    getAnamnesisTotalCount() {
        return db.Anamnesis.count()
    },

    getOneAnamnesis(id) {
        return db.Anamnesis
            .findByPk(id, { include: [{ model: db.AnamnesisQuestion, as: 'questions', include: [{ model: db.QuestionOptions, as: 'options' }]  }] });

    },

    createAnamnesis(bodyParams) {

        return db.Anamnesis.create({
            name: bodyParams.name
        });

    },

    deleteAnamnesis(id) {

        return db.Anamnesis.destroy({
            where: { id }
        });

    },

    createAnamnesisQuestion(id, bodyParams) {

        return db.AnamnesisQuestion.create({
            anamnesis_id: id,
            title: bodyParams.question,
            type: bodyParams.type,
            line_number: bodyParams.line_number,
            options: [{ title: 'Opção 1' }, { title: 'Opção 2' }]
        }, {
                include: [{ model: db.QuestionOptions, as: 'options' }]
            });
    },

    deleteAnamnesisQuestion(id) {
        return db.AnamnesisQuestion.destroy({
            where: { id }
        });
    }

}

module.exports = AnamnesisService;
