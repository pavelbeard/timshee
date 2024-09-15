import Container from "../components/ui/Container";
import {useTranslation} from "react-i18next";
import Error from "./Error";
import founderMobile from '../assets/founder.webp';
// import founderDesktop from '../assets/founder.jpg';

export default function About() {
    const { i18n } = useTranslation();
    const textRu = (
        <>
            <h1>О бренде TIMSHEE</h1>
            <p>Меня зовут Тимур Шибаев.<br/>
                Я основатель бренда TIMSHEE.</p>
            <br/>
            <p>Я запустил бренд в 2013 году. В то время я вернулся домой из Милана, где учился в Istituto Marangoni. В
                Казани я открыл свою первую небольшую студию.</p>
            <br/>
            <p>Я вдохновился эстетикой природной красоты, которую и воплотил в линиях и фактуре своей первой коллекции.
                Эта философия стала основой ДНК моего бренда — каждая созданная мной вещь призвана подчеркнуть единство
                женской красоты и совершенства окружающего мира. Поэтому я выбираю натуральные ткани и шью вещи в
                единственном экземпляре.</p>
            <br/>
            <p>Детство я провёл во Вьетнаме — отсюда страсть к сложному крою и желанию найти баланс между стилистиками
                востока и запада.</p>
        </>
    );
    const textEn = (
        <>
            <h1>About TIMSHEE</h1>
            <p>My name is Timur Shibaev.<br/>
                I'm a founder of TIMSHEE.</p>
            <br/>
            <p>I started the brand in year 2013. In those days I returned home from Milan,
                where I were studying in Istituto Marangoni. In Kazan I opened my first little boutique.</p>
            <br/>
            <p>I had inspired by aesthetics of natural beauty, which I have embodied in lines and a texture of my first collection.
                This philosophy became a basis of my brand DNA. Every piece which I created aims to highlight the unity of feminine beauty and the perfection of the natural world.
                That’s why I choose natural fabrics and make each piece as a one-of-a-kind.</p>
            <br/>
            <p>I spent my childhood in Vietnam, which is where my passion for intricate
                tailoring and the desire to find a balance between Eastern and Western styles comes from.</p>
        </>
    );
    const textEs = (
        <>
            <h1>Sobre TIMSHEE</h1>
            <p>Me llamo Timur Shibaev.<br/>
                Soy fundador de TIMSHEE.</p>
            <br/>
            <p>He lanzado esta marca el año 2013. Por entonces yo regresé de Milan, donde estudiaba en el Istituto Marangoni. En
                Kazan yo abrí mi propio boutique pequeño.</p>
            <br/>
            <p>Me insperé de la aestetica de la belleza natural, la que yo materialicé en las lineas y la textura de mi primera colleción.
                Esta filosofía si en la base del ADN de mi marca. Cada pieza la que yo creí
                está destinada a resaltar la unión entre la belleza femenina y la perfección del mundo que nos rodea.
                Y por eso yo elijo las texturas y telas naturales y creo piezas en edición limitada.</p>
            <br/>
            <p>Yo pasé mi infancia en Vietnam, desde ello tengo la pasión al corte complejo y al deseo encontrar
                un equilibro entre estilísticas Orientales y Occidentales.</p>
        </>
    );

    const about = () => {
        switch (i18n.language) {
            case 'ru':
                return textRu;
            case 'en' || 'en-US':
                return textEn;
            case 'es':
                return textEs;
            default:
                return <Error />
        }

    };

    return (
        <Container className='tracking-wide text-2xl m-auto p-5'>
            <div className="flex flex-col xl:flex-row xl:justify-between">
                <section className="max-w-[800px]">{about()}</section>
                <img
                    // srcSet={`${founderMobile} 480w, ${founderMobile} 768w, ${founderMobile} 1024w, ${founderDesktop} 1280w`}
                    className="mt-4 xl:mt-0 xl:w-1/3"
                    src={founderMobile}
                    alt="founder-img"
                />
            </div>
        </Container>
    )
}