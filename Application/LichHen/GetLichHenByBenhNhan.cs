﻿using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.LichHen
{
    public class GetLichHenByBenhNhan
    {
        public class Query : IRequest<Result<IEnumerable<DLK_LichHen>>>
        {
            public int MaBenhNhan;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_LichHen>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_LichHen>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaBenhNhan", request.MaBenhNhan);
                        var result = await connection.QueryAsync<DLK_LichHen>("SP_Get_LichHenByBenhNhan", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_LichHen>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_LichHen>>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}
