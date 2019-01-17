const listQueryBuilder = require('../utils/builders/list-query.builder');
const db = require("../models/index.js");

const PatientsService = {

    findAndCountAllPatients(queryParams) {

        let queryBuilder = listQueryBuilder(queryParams);

        queryBuilder.include = [{ model: db.HealthInsurance }, { model: db.PatientStatus }];

        /**
         * @TODO Pass this two statements to an optional query in the listQueryBuilder method
         */
        if (queryParams.health_insurance) {
            if (!queryBuilder.where) queryBuilder.where = [];
            queryBuilder.where.push({ health_insurance_id: queryParams.health_insurance == -1 ? null : queryParams.health_insurance });
        }

        if (queryParams.patient_status) {
            if (!queryBuilder.where) queryBuilder.where = [];
            queryBuilder.where.push({ patient_status_id: queryParams.patient_status });
        }


        return db.Patients.findAndCountAll(queryBuilder);
    },

    findPatient(id, sessions_limit) {
        
        return db.Patients
            .findByPk(id, {
                include: [
                    { model: db.HealthInsurance },
                    { model: db.Address },
                    { model: db.Contact },
                    {
                        model: db.Sessions,
                        limit: sessions_limit ? parseInt(sessions_limit) : null,
                        include: [{ model: db.Humour }],
                        order: [
                            [ 'attendance_at', 'desc' ]
                        ]
                    },
                    
                ]
                
            });
    },

    countPatients() {
        return db.Patients.count()
    },

    createPatient(params) {

        return db.Patients.create(
            {
                name: params.name,
                is_private: params.is_private,
                health_insurance_id: params.health_insurance_id || null,
                patient_status_id: 1,
                Contact: {
                    email: params.email,
                    phone: params.phone,
                },
                Address:{
                        city: params.address.city,
                        district: params.address.district,
                        zip_code: params.address.zip_code,
                        street: params.address.street,
                        number: params.address.number,
                        complement: params.address.complement
                    }
                
            },
            {
                include: [db.Address, db.Contact]
            });

    },

    editPatient(id, patient, field) {

        return db.Patients.update(patient, {
            fields: [field],
            where: { id }
        });

    },

    deletePatient(id) {

        return db.Patients.destroy({
            where: { id },
            include: [ db.Contact ]
        });

    }


}

module.exports = PatientsService;