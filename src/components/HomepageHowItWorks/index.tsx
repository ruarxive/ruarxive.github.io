import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type StepItem = {
    number: string;
    title: JSX.Element;
    icon: string;
    description: JSX.Element;
};

const StepList: StepItem[] = [
    {
        number: '01',
        title: <Translate>Идентификация</Translate>,
        icon: '🔍',
        description: <Translate>Сообщество выявляет ресурсы, которым грозит исчезновение</Translate>,
    },
    {
        number: '02',
        title: <Translate>Архивация</Translate>,
        icon: '📥',
        description: <Translate>Автоматизированные инструменты захватывают содержимое</Translate>,
    },
    {
        number: '03',
        title: <Translate>Хранение</Translate>,
        icon: '💾',
        description: <Translate>Двойное хранение: облако и офлайн-копии</Translate>,
    },
    {
        number: '04',
        title: <Translate>Доступ</Translate>,
        icon: '🌍',
        description: <Translate>Публичный каталог и доступ к данным</Translate>,
    },
];

function Step({ number, title, icon, description }: StepItem) {
    return (
        <div className={clsx('col col--3')}>
            <div className={styles.step}>
                <div className={styles.stepNumber}>{number}</div>
                <div className={styles.stepIcon}>{icon}</div>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepDescription}>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageHowItWorks(): JSX.Element {
    return (
        <section className={styles.howItWorks}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    <Translate>Как это работает</Translate>
                </h2>
                <p className={styles.sectionSubtitle}>
                    <Translate>Простой и прозрачный процесс цифровой архивации</Translate>
                </p>
                <div className="row">
                    {StepList.map((props, idx) => (
                        <Step key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
