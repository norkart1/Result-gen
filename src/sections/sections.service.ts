import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(@InjectRepository(Section) private sectionRepository: Repository<Section>) {}

  create(createSectionInput: CreateSectionInput) {
    try {
      const newSectionInput = this.sectionRepository.create(createSectionInput);
      return this.sectionRepository.save(newSectionInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findAll() {
    try {
      return this.sectionRepository.find({
        relations: [
          'categories',
          'candidates',
          'programmes',
          'candidates.team',
          'candidates.candidateProgrammes',
        ],
      });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findOne(id: number) {
    if (!id) {
      throw new HttpException(`section cannot be undefined`, HttpStatus.BAD_REQUEST);
    }
    try {
      const section = this.sectionRepository.findOne({
        where: {
          id,
        },
        relations: [
          'categories',
          'candidates',
          'programmes',
          'candidates.team',
          'candidates.candidateProgrammes',
        ],
      });
      if (!section) {
        throw new HttpException(`can't find section with id ${id}`, HttpStatus.BAD_REQUEST);
      }

      return section;
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findOneByName(name: string) {
    if (!name) {
      throw new HttpException(`section cannot be undefined`, HttpStatus.BAD_REQUEST);
    }
    try {
      const section = this.sectionRepository.findOne({
        where: {
          name,
        },
        relations: [
          'categories',
          'candidates',
          'programmes',
          'candidates.team',
          'candidates.candidateProgrammes',
        ],
      });
      if (!section) {
        throw new HttpException(`can't find section with id ${name}`, HttpStatus.BAD_REQUEST);
      }

      return section;
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async update(id: number, updateSectionInput: UpdateSectionInput) {
    const section = await this.sectionRepository.findOneBy({ id });

    if (!section) {
      throw new HttpException(`Cant find a section `, HttpStatus.BAD_REQUEST);
    }
    // trying to return data

    try {
      return this.sectionRepository.update(id, updateSectionInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async remove(id: number) {
    const section = await this.sectionRepository.findOneBy({ id });

    if (!section) {
      throw new HttpException(`Cant find a section `, HttpStatus.BAD_REQUEST);
    }
    // trying to return data

    try {
      return this.sectionRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}
