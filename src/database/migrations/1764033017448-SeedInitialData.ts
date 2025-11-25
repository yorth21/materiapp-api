import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1764033017448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert campus
    await queryRunner.query(`
      INSERT INTO campuses (name, city, address) VALUES
      ('Udenar Sede Principal', 'Pasto', 'Cra 21 # 26-85')
    `);

    // Insert school
    await queryRunner.query(`
      INSERT INTO schools (name, code, campus_id) VALUES
      ('Facultad de Ingeniería', 'FACING', 1)
    `);

    // Insert program
    await queryRunner.query(`
      INSERT INTO programs (name, code, school_id) VALUES
      ('Ingeniería de Sistemas', '34', 1)
    `);

    // Insert courses
    await queryRunner.query(`
      INSERT INTO courses (code, name) VALUES
      ('C001', 'Programación I'),
      ('C002', 'Introducción A La Ingeniería De Sistemas'),
      ('C003', 'Teoría General De Sistemas'),
      ('C004', 'Matemáticas Generales'),
      ('C005', 'Lógica Matemática'),
      ('C006', 'Programación II'),
      ('C007', 'Metodología De La Investigación'),
      ('C008', 'Calculo Diferencial'),
      ('C009', 'Algebra Lineal'),
      ('C010', 'Ingeniería Económica'),
      ('C011', 'Programación III'),
      ('C012', 'Ingeniería De Software I'),
      ('C013', 'Calculo Integral'),
      ('C014', 'Física I'),
      ('C015', 'Probabilidad Y Estadística'),
      ('C016', 'Estructuras De Datos'),
      ('C017', 'Ingeniería De Software II'),
      ('C018', 'Sistemas De Base De Datos'),
      ('C019', 'Cálculo De Varias Variables'),
      ('C020', 'Física II'),
      ('C021', 'Administración De Sistemas De Base De Datos'),
      ('C022', 'Ingeniería De Software III'),
      ('C023', 'Investigación De Operaciones'),
      ('C024', 'Ecuaciones Diferenciales'),
      ('C025', 'Administración De Empresas'),
      ('C026', 'Métodos Numéricos'),
      ('C027', 'Auditoria Y Seguridad Informática'),
      ('C028', 'Computación Gráfica'),
      ('C029', 'Circuitos Electrónicos'),
      ('C030', 'Sistemas Operativos'),
      ('C031', 'Sistemas Inteligentes'),
      ('C032', 'Lenguajes Formales Y Autómatas'),
      ('C033', 'Modelamiento Y Simulación'),
      ('C034', 'Redes De Computadores'),
      ('C035', 'Arquitectura De Computadores'),
      ('C036', 'Sistemas Basados En Conocimiento'),
      ('C037', 'Sistemas Y Servicios Telemáticos'),
      ('C038', 'Formulación Y Evaluación De Proyectos'),
      ('C039', 'Electiva'),
      ('C040', 'Electiva'),
      ('C041', 'Modelos De Computación'),
      ('C042', 'Emprendimiento'),
      ('C043', 'Proyecto De Investigación I'),
      ('C044', 'Electiva'),
      ('C045', 'Electiva'),
      ('C046', 'Ingeniería Legal'),
      ('C047', 'Proyecto De Investigación II'),
      ('C048', 'Electiva'),
      ('C049', 'Electiva'),
      ('C050', 'Formación en humanismo'),
      ('C051', 'Formación en cultura artística y fisica'),
      ('C052', 'Formación ciudadana'),
      ('C053', 'Formación en problemáticas de contexto'),
      ('C054', 'Lectura y producción de textos I'),
      ('C055', 'Lectura y producción de textos 2')
    `);

    // Insert curriculum
    await queryRunner.query(`
      INSERT INTO curricula (version, created_at, program_id) VALUES
      ('2018', '2017-12-01', 1)
    `);

    // Insert courses in curriculum
    await queryRunner.query(`
      INSERT INTO courses_in_curriculum (semester, credits, calendar, type, curriculum_id, course_id, prerequisite_id) VALUES
      (1, 4, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C001'), NULL),
      (1, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C002'), NULL),
      (1, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C003'), NULL),
      (1, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C004'), NULL),
      (1, 3, 'AB', 'P', 1, (SELECT id FROM courses WHERE code = 'C005'), NULL),
      (2, 4, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C006'), (SELECT id FROM courses WHERE code = 'C001')),
      (2, 3, 'B', 'F', 1, (SELECT id FROM courses WHERE code = 'C007'), (SELECT id FROM courses WHERE code = 'C001')),
      (2, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C008'), (SELECT id FROM courses WHERE code = 'C004')),
      (2, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C009'), (SELECT id FROM courses WHERE code = 'C005')),
      (2, 3, 'B', 'F', 1, (SELECT id FROM courses WHERE code = 'C010'), (SELECT id FROM courses WHERE code = 'C005')),
      (3, 4, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C011'), (SELECT id FROM courses WHERE code = 'C006')),
      (3, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C012'), (SELECT id FROM courses WHERE code = 'C006')),
      (3, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C013'), (SELECT id FROM courses WHERE code = 'C008')),
      (3, 4, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C014'), (SELECT id FROM courses WHERE code = 'C008')),
      (3, 3, 'AB', 'P', 1, (SELECT id FROM courses WHERE code = 'C015'), (SELECT id FROM courses WHERE code = 'C009')),
      (4, 4, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C016'), (SELECT id FROM courses WHERE code = 'C011')),
      (4, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C017'), (SELECT id FROM courses WHERE code = 'C012')),
      (4, 4, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C018'), NULL),
      (4, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C019'), (SELECT id FROM courses WHERE code = 'C013')),
      (4, 4, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C020'), (SELECT id FROM courses WHERE code = 'C014')),
      (5, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C021'), (SELECT id FROM courses WHERE code = 'C018')),
      (5, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C022'), (SELECT id FROM courses WHERE code = 'C017')),
      (5, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C023'), (SELECT id FROM courses WHERE code = 'C009')),
      (5, 3, 'AB', 'F', 1, (SELECT id FROM courses WHERE code = 'C024'), (SELECT id FROM courses WHERE code = 'C019')),
      (5, 3, 'A', 'F', 1, (SELECT id FROM courses WHERE code = 'C025'), (SELECT id FROM courses WHERE code = 'C010')),
      (6, 3, 'B', 'F', 1, (SELECT id FROM courses WHERE code = 'C026'), (SELECT id FROM courses WHERE code = 'C008')),
      (6, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C027'), NULL),
      (6, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C028'), NULL),
      (6, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C029'), (SELECT id FROM courses WHERE code = 'C020')),
      (6, 4, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C030'), NULL),
      (7, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C031'), NULL),
      (7, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C032'), NULL),
      (7, 4, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C033'), (SELECT id FROM courses WHERE code = 'C015')),
      (7, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C034'), (SELECT id FROM courses WHERE code = 'C030')),
      (7, 4, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C035'), (SELECT id FROM courses WHERE code = 'C029')),
      (8, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C036'), (SELECT id FROM courses WHERE code = 'C031')),
      (8, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C037'), (SELECT id FROM courses WHERE code = 'C034')),
      (8, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C038'), (SELECT id FROM courses WHERE code = 'C025')),
      (8, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C039'), NULL),
      (8, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C040'), NULL),
      (9, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C041'), (SELECT id FROM courses WHERE code = 'C037')),
      (9, 3, 'A', 'F', 1, (SELECT id FROM courses WHERE code = 'C042'), NULL),
      (9, 3, 'A', 'P', 1, (SELECT id FROM courses WHERE code = 'C043'), NULL),
      (9, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C044'), NULL),
      (9, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C045'), NULL),
      (10, 3, 'B', 'F', 1, (SELECT id FROM courses WHERE code = 'C046'), NULL),
      (10, 3, 'B', 'P', 1, (SELECT id FROM courses WHERE code = 'C047'), (SELECT id FROM courses WHERE code = 'C043')),
      (10, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C048'), NULL),
      (10, 3, 'AB', 'E', 1, (SELECT id FROM courses WHERE code = 'C049'), NULL),
      (0, 2, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C050'), NULL),
      (0, 2, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C051'), NULL),
      (0, 2, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C052'), NULL),
      (0, 2, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C053'), NULL),
      (0, 1, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C054'), NULL),
      (0, 1, 'AB', 'H', 1, (SELECT id FROM courses WHERE code = 'C055'), (SELECT id FROM courses WHERE code = 'C054'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order due to foreign key constraints

    // Delete courses in curriculum
    await queryRunner.query(`
      DELETE FROM courses_in_curriculum WHERE curriculum_id = 1
    `);

    // Delete curriculum
    await queryRunner.query(`
      DELETE FROM curricula WHERE version = '2018' AND program_id = 1
    `);

    // Delete courses
    await queryRunner.query(`
      DELETE FROM courses WHERE code IN (
        'C001', 'C002', 'C003', 'C004', 'C005', 'C006', 'C007', 'C008', 'C009', 'C010',
        'C011', 'C012', 'C013', 'C014', 'C015', 'C016', 'C017', 'C018', 'C019', 'C020',
        'C021', 'C022', 'C023', 'C024', 'C025', 'C026', 'C027', 'C028', 'C029', 'C030',
        'C031', 'C032', 'C033', 'C034', 'C035', 'C036', 'C037', 'C038', 'C039', 'C040',
        'C041', 'C042', 'C043', 'C044', 'C045', 'C046', 'C047', 'C048', 'C049', 'C050',
        'C051', 'C052', 'C053', 'C054', 'C055'
      )
    `);

    // Delete program
    await queryRunner.query(`
      DELETE FROM programs WHERE code = '34' AND school_id = 1
    `);

    // Delete school
    await queryRunner.query(`
      DELETE FROM schools WHERE code = 'FACING' AND campus_id = 1
    `);

    // Delete campus
    await queryRunner.query(`
      DELETE FROM campuses WHERE name = 'Udenar Sede Principal'
    `);
  }
}
