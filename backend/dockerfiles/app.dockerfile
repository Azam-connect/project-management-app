FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install npm dependencies
RUN npm ci --only=production
# RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# COPY wait-for-it.sh /wait-for-it.sh
# RUN chmod +x /app/wait-for-it.sh

# Set environment variable
ENV NODE_ENV=production
ENV DEBUG=log
ENV DB_URL=mongodb://root:tiger@db:27017/pma?authSource=admin
ENV PORT=3001
ENV PASSWORD_SALT=10
ENV JWT_ACCESS_TOKEN_SECRET=AQMLDL0pcaSEFReACEIWDLAM
ENV JWT_ACCESS_TOKEN_LIFE=1d
ENV JWT_REFRESH_TOKEN_SECRET=MMCAweofoaCEWR4wfaEaDFwe
ENV JWT_REFRESH_TOKEN_LIFE=30d


# Expose port 3001
EXPOSE 3001

