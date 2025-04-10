using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChungChiChuyenGia
{
    public class Gets
    {
        public class  Query: IRequest<Result<IEnumerable<DLK_ChungChiChuyenGia>>>
        {
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ChungChiChuyenGia>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ChungChiChuyenGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_ChungChiChuyenGia>("SP_Gets_ChungChiChuyenGia", null, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_ChungChiChuyenGia>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ChungChiChuyenGia>>.Failure(ex.Message);
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
