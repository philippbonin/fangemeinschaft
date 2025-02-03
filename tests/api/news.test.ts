import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getNews, getNewsById, createNews, updateNews, deleteNews } from '../../src/utils/news';
import { validateResponse, validateRequest } from '../helpers/openapi';

describe('News API', () => {
  const testNews = {
    id: '1',
    title: 'Test News',
    content: 'Test Content',
    image: 'https://example.com/test.jpg',
    category: 'Team News',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should get all news with valid response schema', async () => {
    prismaMock.news.findMany.mockResolvedValue([testNews]);
    const news = await getNews();
    expect(validateResponse('/news', 'GET', 200, news)).toBe(true);
  });

  test('should get news by id with valid response schema', async () => {
    prismaMock.news.findUnique.mockResolvedValue(testNews);
    const news = await getNewsById('1');
    expect(validateResponse('/news/{id}', 'GET', 200, news)).toBe(true);
  });

  test('should create news with valid request and response schema', async () => {
    const { id, createdAt, updatedAt, ...createData } = testNews;
    expect(validateRequest('/news', 'POST', createData)).toBe(true);

    prismaMock.news.create.mockResolvedValue(testNews);
    const news = await createNews(createData);
    expect(validateResponse('/news', 'POST', 201, news)).toBe(true);
  });

  test('should update news with valid request and response schema', async () => {
    const updateData = { title: 'Updated Title' };
    expect(validateRequest('/news/{id}', 'PUT', updateData)).toBe(true);

    prismaMock.news.update.mockResolvedValue({ ...testNews, ...updateData });
    const news = await updateNews('1', updateData);
    expect(validateResponse('/news/{id}', 'PUT', 200, news)).toBe(true);
  });

  test('should delete news', async () => {
    prismaMock.news.delete.mockResolvedValue(testNews);
    const result = await deleteNews('1');
    expect(result).toBe(true);
  });
});