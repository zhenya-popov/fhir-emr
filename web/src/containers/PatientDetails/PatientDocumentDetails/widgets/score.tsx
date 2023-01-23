import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './ReadonlyWidgets.module.scss';

function getAnxietyScoreInterpretation(score: number) {
    if (score <= 4) {
        return 'Minimal anxiety';
    } else if (score <= 9) {
        return 'Mild anxiety';
    } else if (score <= 14) {
        return 'Moderate anxiety';
    } else {
        return 'Severe anxiety';
    }
}

export function AnxietyScore({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.row)}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {typeof value !== 'undefined'
                    ? `${value} (${getAnxietyScoreInterpretation(value)})`
                    : null}
            </span>
        </p>
    );
}

function getDepressionScoreInterpretation(score: number) {
    if (score <= 4) {
        return 'Minimal depression';
    } else if (score <= 9) {
        return 'Mild depression';
    } else if (score <= 14) {
        return 'Moderate depression';
    } else if (score <= 19) {
        return 'Moderately severe depression';
    } else {
        return 'Severed depression';
    }
}

export function DepressionScore({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.row)}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {typeof value !== 'undefined'
                    ? `${value} (${getDepressionScoreInterpretation(value)})`
                    : null}
            </span>
        </p>
    );
}
