import { Email, Link, Phone } from '@mui/icons-material';
import { ListItem, Section as SectionType } from '@reactive-resume/schema';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import Markdown from '@/components/shared/Markdown';
import { useAppSelector } from '@/store/hooks';
import { SectionProps } from '@/templates/sectionMap';
import DataDisplay from '@/templates/shared/DataDisplay';
import { formatDateString } from '@/utils/date';
import { addHttp, parseListItemPath } from '@/utils/template';

import Heading from './Heading';

const amountOfDots = 5;

const Section: React.FC<SectionProps> = ({
  path,
  titlePath = 'title',
  subtitlePath = 'subtitle',
  headlinePath = 'headline',
  keywordsPath = 'keywords',
}) => {
  const section: SectionType = useAppSelector((state) => get(state.resume, path, {}));
  const dateFormat: string = useAppSelector((state) => get(state.resume, 'metadata.date.format'));
  const primaryColor: string = useAppSelector((state) => get(state.resume, 'metadata.theme.primary'));

  if (!section.visible) return null;

  if (isArray(section.items) && isEmpty(section.items)) return null;

  return (
    <section>
      <Heading>{section.name}</Heading>

      <div
        className={
          section.id && ['skills', 'interests', 'languages'].includes(section.id)
            ? 'gap-1 grid items-start'
            : 'gap-2 grid items-start'
        }
        style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
      >
        {section.items.map((item: ListItem) => {
          const id = item.id,
            title = parseListItemPath(item, titlePath),
            subtitle = parseListItemPath(item, subtitlePath),
            headline = parseListItemPath(item, headlinePath),
            keywords: string[] = get(item, keywordsPath),
            url: string = get(item, 'url'),
            summary: string = get(item, 'summary'),
            level: string = get(item, 'level'),
            levelNum: number = get(item, 'levelNum'),
            phone: string = get(item, 'phone'),
            email: string = get(item, 'email'),
            date = formatDateString(get(item, 'date'), dateFormat),
            description: string = get(item, 'description');

          return (
            <div key={id} id={id} className="grid gap-0.5">
              {title && (
                <span
                  className={
                    section.id && ['work', 'education'].includes(section.id) ? 'font-semibold text-sm' : 'font-semibold'
                  }
                >
                  {title}
                </span>
              )}

              {description && <Markdown>{description}</Markdown>}

              {url && (
                <DataDisplay icon={<Link />} link={addHttp(url)}>
                  {url}
                </DataDisplay>
              )}

              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  {subtitle && (
                    <span className={section.id == 'work' ? 'font-semibold text-sm opacity-75' : 'opacity-75'}>
                      {subtitle}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-right">
                  {date && <div className="opacity-50">({date})</div>}
                  {headline && <span className="opacity-75">{headline}</span>}
                </div>
              </div>

              {(level || levelNum > 0) && (
                <div className="grid gap-1">
                  {level && <span className="opacity-75 text-xxs">{level}</span>}
                  {levelNum > 0 && (
                    <div className="flex">
                      {Array.from(Array(amountOfDots).keys()).map((_, index) => (
                        <div
                          key={index}
                          className="mr-1 h-2 w-2 rounded-full border"
                          style={{
                            borderColor: primaryColor,
                            backgroundColor: levelNum / (10 / amountOfDots) > index ? primaryColor : '',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {summary && <Markdown>{summary}</Markdown>}

              {keywords && <div>{keywords.join(', ')}</div>}

              {(phone || email) && (
                <div className="grid gap-1">
                  {phone && (
                    <DataDisplay icon={<Phone />} link={`tel:${phone}`}>
                      {phone}
                    </DataDisplay>
                  )}

                  {email && (
                    <DataDisplay icon={<Email />} link={`mailto:${email}`}>
                      {email}
                    </DataDisplay>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Section;
