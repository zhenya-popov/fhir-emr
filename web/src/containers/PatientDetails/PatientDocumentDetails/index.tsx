import Title from 'antd/lib/typography/Title';
import { ReactElement, useContext, useEffect } from 'react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';
import {
    calcInitialContext,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, WithId } from 'aidbox-react/lib/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { PatientDocument } from '../PatientDocument';
import { usePatientDocument } from '../PatientDocument/usePatientDocument';
import { PatientHeaderContext } from '../PatientHeader/context';
import s from './PatientDocumentDetails.module.scss';
import { QuestionChoice } from './widgets/choice';
import { Group } from './widgets/group';
import { QuestionInteger } from './widgets/integer';
import { AnxietyScore, DepressionScore } from './widgets/score';
import { QuestionText } from './widgets/string';

interface Props {
    patient: WithId<Patient>;
}

function usePatientDocumentDetails() {
    const params = useParams<{ qrId: string }>();
    const qrId = params.qrId!;

    const [response] = useService(
        async () =>
            await getFHIRResource<QuestionnaireResponse>({
                resourceType: 'QuestionnaireResponse',
                id: qrId,
            }),
    );

    return { response };
}

function PatientDocumentDetailsReadonly(props: { formData: QuestionnaireResponseFormData }) {
    const { formData } = props;
    // const location = useLocation();
    // const navigate = useNavigate();

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.header}>
                    <Title level={4} className={s.title}>
                        {formData.context.questionnaire.name}
                    </Title>
                    {/* <Button
                        type="link"
                        onClick={() => navigate(`${location.pathname}/edit`)}
                        className={s.editButton}
                    >
                        <Trans>Edit</Trans>
                    </Button> */}
                </div>
                <QuestionnaireResponseFormProvider
                    formValues={formData.formValues}
                    setFormValues={() => {}}
                    groupItemComponent={Group}
                    questionItemComponents={{
                        text: QuestionText,
                        string: QuestionText,
                        integer: QuestionInteger,
                        choice: QuestionChoice,
                    }}
                    itemControlQuestionItemComponents={{
                        'inline-choice': QuestionChoice,
                        'anxiety-score': AnxietyScore,
                        'depression-score': DepressionScore,
                    }}
                >
                    <>
                        <QuestionItems
                            questionItems={formData.context.questionnaire.item!}
                            parentPath={[]}
                            context={calcInitialContext(formData.context, formData.formValues)}
                        />
                    </>
                </QuestionnaireResponseFormProvider>
            </div>
        </div>
    );
}

function PatientDocumentDetailsFormData(props: {
    questionnaireResponse: WithId<QuestionnaireResponse>;
    patient: WithId<Patient>;
    children: (props: { formData: QuestionnaireResponseFormData }) => ReactElement;
}) {
    const { questionnaireResponse, children } = props;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId: questionnaireResponse.questionnaire!,
    });

    return (
        <RenderRemoteData remoteData={response}>
            {(formData) => children({ formData })}
        </RenderRemoteData>
    );
}

export function PatientDocumentDetails(props: Props) {
    const { patient } = props;
    const { response } = usePatientDocumentDetails();
    const params = useParams<{ encounterId?: string }>();
    const { setTitle } = useContext(PatientHeaderContext);

    useEffect(() => {
        if (params.encounterId) {
            setTitle('Consultation');
        }
    }, [setTitle, params.encounterId]);

    return (
        <RenderRemoteData remoteData={response}>
            {(qr) => (
                <PatientDocumentDetailsFormData questionnaireResponse={qr} {...props}>
                    {({ formData }) => (
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Outlet />
                                    </>
                                }
                            >
                                <Route
                                    path="/"
                                    element={<PatientDocumentDetailsReadonly formData={formData} />}
                                />
                                <Route
                                    path="/edit"
                                    element={
                                        <PatientDocument
                                            patient={patient}
                                            questionnaireResponse={qr}
                                            questionnaireId={qr.questionnaire}
                                        />
                                    }
                                />
                            </Route>
                        </Routes>
                    )}
                </PatientDocumentDetailsFormData>
            )}
        </RenderRemoteData>
    );
}